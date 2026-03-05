import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { reportGenerationSchema } from '@/lib/validation';
import { renderReportOutputs } from '@/lib/reporting/report-generator';
import { sha256 } from '@/lib/hash';
import { REPORT_OUTPUT_ARTIFACT_TYPES } from '@/types/mining';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'REPORT_GENERATE', resourceType: 'report_job' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = reportGenerationSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const input = parsed.data;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const now = nowIso();
      const reportJobId = mockId('report_job');
      const reportJob = {
        id: reportJobId,
        workspace_id: ctx.workspaceId,
        repo_id: ctx.params.repoId,
        branch_id: input.branch_id,
        score_run_id: input.score_run_id || null,
        drill_plan_id: input.drill_plan_id || null,
        template_type: input.template_type,
        output_formats: input.output_formats,
        status: 'completed' as const,
        error_message: null,
        created_at: now,
        started_at: now,
        completed_at: now,
      };
      state.reportJobs.unshift(reportJob);

      input.output_formats.forEach((format) => {
        state.reports.unshift({
          id: mockId('report'),
          workspace_id: ctx.workspaceId,
          repo_id: ctx.params.repoId,
          branch_id: input.branch_id,
          report_job_id: reportJobId,
          output_type: format,
          artifact_id: null,
          storage_path: `mock/${reportJobId}.${format}`,
          mime_type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          size_bytes: 1024,
          metadata: { title: input.title || null, mock: true },
          created_at: now,
        });
      });

      return NextResponse.json({ report_job_id: reportJobId }, { status: 201 });
    }

    const { rows: branchRows } = await ctx.db.query(
      `SELECT b.id, b.name, r.name AS repo_name
       FROM branches b
       JOIN repos r ON r.id = b.repo_id
       WHERE b.id = $1 AND b.repo_id = $2 AND b.workspace_id = $3`,
      [input.branch_id, ctx.params.repoId, ctx.workspaceId]
    );

    if (branchRows.length === 0) throw badRequest('Branch not found for repo');

    const branch = branchRows[0] as { id: string; name: string; repo_name: string };

    const { rows: jobRows } = await ctx.db.query(
      `INSERT INTO report_jobs (
        workspace_id, repo_id, branch_id, score_run_id, drill_plan_id,
        template_type, output_formats, status, metadata, created_by, started_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,'running',$8,$9,NOW()
      ) RETURNING *`,
      [
        ctx.workspaceId,
        ctx.params.repoId,
        input.branch_id,
        input.score_run_id || null,
        input.drill_plan_id || null,
        input.template_type,
        input.output_formats,
        JSON.stringify({ include_financials: input.include_financials, include_maps: input.include_maps }),
        ctx.user.sub,
      ]
    );

    const reportJob = jobRows[0];

    const [scoreRunResult, drillPlanResult] = await Promise.all([
      input.score_run_id
        ? ctx.db.query('SELECT * FROM target_score_runs WHERE id = $1 AND workspace_id = $2', [input.score_run_id, ctx.workspaceId])
        : Promise.resolve({ rows: [] }),
      input.drill_plan_id
        ? ctx.db.query('SELECT * FROM drill_plans WHERE id = $1 AND workspace_id = $2', [input.drill_plan_id, ctx.workspaceId])
        : Promise.resolve({ rows: [] }),
    ]);

    try {
      const outputs = await renderReportOutputs(
        ctx.workspaceId,
        ctx.params.repoId,
        {
          title: input.title || `${branch.repo_name} ${input.template_type}`,
          templateType: input.template_type,
          repoName: branch.repo_name,
          branchName: branch.name,
          scoreSummary: scoreRunResult.rows[0]?.output_summary || {},
          drillPlan: drillPlanResult.rows[0]?.phase_plan || {},
          generatedAt: new Date().toISOString(),
        },
        input.output_formats
      );

      for (const output of outputs) {
        const artifactType = REPORT_OUTPUT_ARTIFACT_TYPES[output.outputType];

        const { rows: artifactRows } = await ctx.db.query(
          `INSERT INTO artifacts (
            workspace_id, repo_id, branch_id, type, title, filename, mime_type,
            size_bytes, sha256, storage_path, metadata_json, created_by
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
          ) RETURNING id`,
          [
            ctx.workspaceId,
            ctx.params.repoId,
            input.branch_id,
            artifactType,
            `${input.template_type} output`,
            output.filename,
            output.mimeType,
            output.buffer.length,
            sha256(output.buffer),
            output.storagePath,
            JSON.stringify({ report_job_id: reportJob.id, output_type: output.outputType }),
            ctx.user.sub,
          ]
        );

        await ctx.db.query(
          `INSERT INTO reports (
            workspace_id, repo_id, branch_id, report_job_id,
            output_type, artifact_id, storage_path, mime_type, size_bytes, metadata
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
          )`,
          [
            ctx.workspaceId,
            ctx.params.repoId,
            input.branch_id,
            reportJob.id,
            output.outputType,
            artifactRows[0].id,
            output.storagePath,
            output.mimeType,
            output.buffer.length,
            JSON.stringify({ title: input.title || null }),
          ]
        );
      }

      await ctx.db.query('UPDATE report_jobs SET status = $1, completed_at = NOW() WHERE id = $2', ['completed', reportJob.id]);

      return NextResponse.json({ report_job_id: reportJob.id }, { status: 201 });
    } catch (error) {
      await ctx.db.query(
        'UPDATE report_jobs SET status = $1, error_message = $2, completed_at = NOW() WHERE id = $3',
        ['failed', error instanceof Error ? error.message : 'Report generation failed', reportJob.id]
      );
      throw error;
    }
  },
});
