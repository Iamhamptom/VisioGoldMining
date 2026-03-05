interface QueuePayload {
  type: 'ingestion' | 'report';
  payload: Record<string, unknown>;
}

let queueCache: {
  queueName: string;
  queue: { add: (name: string, data: Record<string, unknown>) => Promise<{ id?: string }> };
} | null = null;

export async function enqueueJob(queueName: string, jobName: string, payload: Record<string, unknown>): Promise<string | null> {
  try {
    if (!process.env.REDIS_URL) {
      return null;
    }

    if (!queueCache || queueCache.queueName !== queueName) {
      const bullmqModuleName = 'bullmq';
      const ioredisModuleName = 'ioredis';
      const { Queue } = await import(bullmqModuleName);
      const { default: IORedis } = await import(ioredisModuleName);
      const connection = new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
      });

      queueCache = {
        queueName,
        queue: new Queue(queueName, { connection }),
      };
    }

    const job = await queueCache.queue.add(jobName, payload);
    return job.id ? String(job.id) : null;
  } catch {
    return null;
  }
}

export async function enqueueIngestionJob(payload: Record<string, unknown>): Promise<string | null> {
  return enqueueJob('visiogold-ingestion', 'ingest-data-asset', payload);
}

export async function enqueueReportJob(payload: Record<string, unknown>): Promise<string | null> {
  return enqueueJob('visiogold-reports', 'generate-report', payload);
}

export function toQueuePayload(type: QueuePayload['type'], payload: Record<string, unknown>): QueuePayload {
  return { type, payload };
}
