import { createObjectCsvStringifier } from 'csv-writer';
import { createReadStream, promises as fs, ReadStream } from 'fs';
import os from 'os';
import path from 'path';
import { finished } from 'stream';

export const REPORT_BATCH_SIZE = 2000;

export async function uploadBatchedCsv<T extends { id: number }, R>(
  options: {
    headers: Array<{ id: string; title: string }>;
    fetchBatch: (afterId?: number) => Promise<T[]>;
    formatRow: (row: T) => Record<string, unknown>;
  },
  upload: (body: ReadStream) => Promise<R>
): Promise<R> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'rcd-report-'));
  let file: AwaitedFile | undefined;
  let stream: ReadStream | undefined;
  try {
    await fs.chmod(directory, 0o700);
    const filename = path.join(directory, 'report.csv');
    file = await fs.open(filename, 'wx', 0o600);
    const csv = createObjectCsvStringifier({ header: options.headers });
    await file.writeFile(csv.getHeaderString() || '');
    let afterId: number | undefined;
    let hasMore = true;
    while (hasMore) {
      const batch = await options.fetchBatch(afterId);
      if (!batch.length) break;
      if (batch.length > REPORT_BATCH_SIZE) throw new Error('Report query exceeded batch limit');
      for (const row of batch) {
        if (!Number.isSafeInteger(row.id) || (afterId !== undefined && row.id <= afterId)) {
          throw new Error('Report query must return unique ascending IDs');
        }
        afterId = row.id;
      }
      await file.writeFile(csv.stringifyRecords(batch.map(options.formatRow)));
      hasMore = batch.length === REPORT_BATCH_SIZE;
    }
    await file.close();
    file = undefined;
    stream = createReadStream(filename);
    return await upload(stream);
  } finally {
    if (stream) {
      const completedStream = stream;
      // Wait for the descriptor to close before unlinking, including uploads that fail before open.
      await new Promise<void>(resolve => {
        const cleanup = finished(completedStream, () => {
          cleanup();
          resolve();
        });
        completedStream.destroy();
      });
    }
    try {
      await file?.close();
    } finally {
      await fs.rm(directory, { recursive: true, force: true });
    }
  }
}

type AwaitedFile = ReturnType<typeof fs.open> extends Promise<infer T> ? T : never;
