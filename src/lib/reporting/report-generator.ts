import { storeFile } from '@/lib/storage';

interface ReportContext {
  title: string;
  templateType: 'board_technical' | 'investor_pack' | 'gov_permit_community';
  repoName: string;
  branchName: string;
  scoreSummary?: Record<string, unknown>;
  drillPlan?: Record<string, unknown>;
  generatedAt: string;
}

interface RenderedOutput {
  outputType: 'pdf' | 'pptx';
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

function buildHtml(context: ReportContext): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${context.title}</title>
<style>
body { font-family: Arial, sans-serif; margin: 40px; }
h1 { color: #b28704; }
h2 { margin-top: 24px; }
pre { background: #f4f4f4; padding: 12px; overflow: auto; }
</style>
</head>
<body>
  <h1>${context.title}</h1>
  <p><strong>Template:</strong> ${context.templateType}</p>
  <p><strong>Repository:</strong> ${context.repoName}</p>
  <p><strong>Branch:</strong> ${context.branchName}</p>
  <p><strong>Generated:</strong> ${context.generatedAt}</p>

  <h2>Target Scoring Summary</h2>
  <pre>${JSON.stringify(context.scoreSummary || {}, null, 2)}</pre>

  <h2>Drill Plan Summary</h2>
  <pre>${JSON.stringify(context.drillPlan || {}, null, 2)}</pre>
</body>
</html>`;
}

async function renderPdfWithOptionalPuppeteer(html: string): Promise<Buffer> {
  try {
    const moduleName = 'puppeteer';
    const puppeteer = await import(moduleName);
    const browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdf);
  } catch {
    // Fallback: store HTML bytes if Puppeteer is unavailable.
    return Buffer.from(html, 'utf8');
  }
}

async function renderPptxWithOptionalLibrary(context: ReportContext): Promise<Buffer> {
  try {
    const moduleName = 'pptxgenjs';
    const { default: PptxGenJS } = await import(moduleName);
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    const slide1 = pptx.addSlide();
    slide1.addText(context.title, { x: 0.5, y: 0.5, w: 12, h: 0.8, fontSize: 24, color: 'B28704', bold: true });
    slide1.addText(`Template: ${context.templateType}\nRepo: ${context.repoName}\nBranch: ${context.branchName}`, {
      x: 0.5,
      y: 1.5,
      w: 12,
      h: 1.5,
      fontSize: 14,
      color: '333333',
    });

    const slide2 = pptx.addSlide();
    slide2.addText('Target Scoring Summary', { x: 0.5, y: 0.5, w: 12, h: 0.6, fontSize: 20, bold: true });
    slide2.addText(JSON.stringify(context.scoreSummary || {}, null, 2).slice(0, 2800), {
      x: 0.5,
      y: 1.2,
      w: 12,
      h: 5.8,
      fontSize: 10,
      fontFace: 'Courier New',
      color: '222222',
    });

    const arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });
    return Buffer.from(arrayBuffer);
  } catch {
    return Buffer.from(JSON.stringify(context, null, 2), 'utf8');
  }
}

export async function renderReportOutputs(
  workspaceId: string,
  repoId: string,
  context: ReportContext,
  formats: Array<'pdf' | 'pptx'>
): Promise<Array<RenderedOutput & { storagePath: string }>> {
  const html = buildHtml(context);

  const outputs: RenderedOutput[] = [];
  if (formats.includes('pdf')) {
    const buffer = await renderPdfWithOptionalPuppeteer(html);
    outputs.push({
      outputType: 'pdf',
      buffer,
      mimeType: 'application/pdf',
      filename: `${context.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`,
    });
  }

  if (formats.includes('pptx')) {
    const buffer = await renderPptxWithOptionalLibrary(context);
    outputs.push({
      outputType: 'pptx',
      buffer,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      filename: `${context.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pptx`,
    });
  }

  const persisted: Array<RenderedOutput & { storagePath: string }> = [];
  for (const output of outputs) {
    const storagePath = await storeFile(workspaceId, repoId, output.buffer, output.filename);
    persisted.push({ ...output, storagePath });
  }

  return persisted;
}
