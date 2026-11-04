import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { uploadBatchedCsv, REPORT_BATCH_SIZE } from '@lib/reports/batched-csv';
import { generateApplicationsReport, generatePermitHoldersReport } from '@lib/reports/resolvers';
import { APPLICATIONS_COLUMNS, PERMIT_HOLDERS_COLUMNS } from '@tools/admin/reports';
import { Prisma } from '@prisma/client';

const csvParser = require('csv-parser');
const s3 = require('../../lib/utils/s3-utils');

async function parse(body: Readable): Promise<any[]> {
  const rows: any[] = [];
  for await (const row of body.pipe(csvParser())) rows.push(row);
  return rows;
}

export default async function (): Promise<void> {
  const originalTimeZone = process.env.NEXT_PUBLIC_LOCAL_TIMEZONE;
  process.env.NEXT_PUBLIC_LOCAL_TIMEZONE = 'America/Vancouver';
  const directories: string[] = [];
  const originalMkdtemp = fs.promises.mkdtemp;
  const originalOpen = fs.promises.open;
  (fs.promises as any).mkdtemp = async (...args: any[]) => {
    const directory = await (originalMkdtemp as any)(...args);
    directories.push(directory);
    return directory;
  };
  const headers = [{ id: 'id', title: 'Marker' }];
  try {
    for (const total of [0, 1, 2000, 2001, 32768, 40001]) {
      let batches = 0;
      const count = await uploadBatchedCsv(
        {
          headers,
          fetchBatch: async after => {
            batches++;
            const start = after === undefined ? 0 : (after + 1) / 2;
            return Array.from(
              { length: Math.min(REPORT_BATCH_SIZE, Math.max(0, total - start)) },
              (_, index) => ({ id: (start + index) * 2 + 1 })
            );
          },
          formatRow: row => row,
        },
        async body => {
          assert.equal(fs.statSync(path.dirname(body.path as string)).mode & 0o777, 0o700);
          assert.equal(fs.statSync(body.path).mode & 0o777, 0o600);
          let count = 0;
          for await (const row of body.pipe(csvParser())) {
            assert.equal(Number(row.Marker), count * 2 + 1);
            count++;
          }
          return count;
        }
      );
      assert.equal(count, total);
      assert.ok(batches <= Math.ceil(total / REPORT_BATCH_SIZE) + 1);
    }
    let uploaded = false;
    for (const failure of ['query', 'format', 'upload', 'disk']) {
      let calls = 0;
      if (failure === 'disk') {
        (fs.promises as any).open = async (...args: any[]) => {
          const file = await (originalOpen as any)(...args);
          file.writeFile = async () => {
            throw Object.assign(new Error('Synthetic disk full'), { code: 'ENOSPC' });
          };
          return file;
        };
      }
      await assert.rejects(
        uploadBatchedCsv(
          {
            headers,
            fetchBatch: async () => {
              calls++;
              if (failure === 'query' && calls === 2) throw new Error('Synthetic query failure');
              if (calls > 1) return [];
              return Array.from({ length: REPORT_BATCH_SIZE }, (_, id) => ({ id: id + 1 }));
            },
            formatRow: row => {
              if (failure === 'format') throw new Error('Synthetic formatting failure');
              return row;
            },
          },
          async () => {
            uploaded = true;
            throw new Error('Synthetic upload failure');
          }
        )
      );
      (fs.promises as any).open = originalOpen;
      if (failure === 'query' || failure === 'format' || failure === 'disk')
        assert.equal(uploaded, false);
      if (failure === 'upload') assert.equal(uploaded, true);
      uploaded = false;
    }
    await assert.rejects(
      uploadBatchedCsv(
        { headers, fetchBatch: async () => [{ id: 2 }, { id: 1 }], formatRow: row => row },
        async () => undefined
      ),
      /unique ascending IDs/
    );
    assert.ok(directories.every(directory => !fs.existsSync(directory)));

    const originalUpload = s3.serverUploadToS3;
    const originalSigned = s3.getSignedUrlForS3;
    const output: any[][] = [];
    const keys: string[] = [];
    s3.serverUploadToS3 = async (body: Readable, key: string) => {
      output.push(await parse(body));
      keys.push(key);
      return { key };
    };
    s3.getSignedUrlForS3 = (key: string) => `https://synthetic.invalid/${key}`;
    const person = {
      firstName: 'Synthetic, "First"',
      middleName: null,
      lastName: 'Holder',
      dateOfBirth: new Date('1950-01-01'),
      addressLine1: 'Synthetic\nStreet',
      addressLine2: null,
      city: 'Richmond',
      province: 'BC',
      postalCode: 'V0V0V0',
      phone: '0000000000',
      email: 'synthetic@example.invalid',
      status: 'ACTIVE',
      guardian: null,
      permits: [{ rcdPermitId: 123, type: 'PERMANENT', expiryDate: new Date('2029-01-31') }],
    };
    const records = ['NEW', 'RENEWAL', 'REPLACEMENT'].map((type, index) => ({
      ...person,
      id: index + 1,
      type,
      createdAt: new Date('2026-01-02T20:00:00Z'),
      processingFee: new Prisma.Decimal('26.50'),
      donationAmount: new Prisma.Decimal('10'),
      secondProcessingFee: new Prisma.Decimal('1.25'),
      secondDonationAmount: null,
      paymentMethod: 'CASH',
      secondPaymentMethod: null,
      applicant: { id: 999, dateOfBirth: new Date('1950-01-01') },
      applicationProcessing: { appNumber: 123, invoiceNumber: 456, applicationInvoice: null },
      newApplication: { dateOfBirth: new Date('1951-01-01') },
      permit: { rcdPermitId: 123 },
    }));
    const queries: any[] = [];
    const model = {
      findFirst: async () => ({ id: 3 }),
      findMany: async (query: any) => {
        queries.push(query);
        assert.equal(query.take, REPORT_BATCH_SIZE);
        assert.deepEqual(query.orderBy, { id: 'asc' });
        assert.equal(query.where.id.lte, 3);
        return records;
      },
    };
    const context: any = {
      prisma: { applicant: model, application: model },
      session: { id: 1 },
      logger: { error: () => undefined },
    };
    const input = {
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      columns: APPLICATIONS_COLUMNS.map(column => column.value),
    };
    try {
      const result: any = await generateApplicationsReport(
        undefined,
        { input },
        context,
        {} as any
      );
      assert.equal(result.ok, true);
      assert.equal(output[0].length, 3);
      assert.equal(output[0][0]['User ID'], '999');
      assert.equal(output[0][0]['Applicant Name'], 'Synthetic, "First" Holder');
      assert.equal(output[0][0].Address, 'Synthetic\nStreet');
      assert.equal(output[0][0]['Total Amount'], '$37.75');
      assert.equal(output[0][0]['Applicant DoB'], '1951-01-01');
      assert.equal(output[0][1]['Applicant DoB'], '1950-01-01');
      assert.equal(output[0][2]['Applicant DoB'], '1950-01-01');
      assert.equal(output[0][0]['Invoice Receipt #'], '20260102-456');
      assert.equal(output[0][0]['Tax Receipt #'], 'PPD_20260102_123');
      await generatePermitHoldersReport(
        undefined,
        { input: { ...input, columns: PERMIT_HOLDERS_COLUMNS.map(column => column.value) } },
        context,
        {} as any
      );
      assert.equal(output[1].length, 3);
      assert.equal(output[1][0]['User ID'], '1');
      assert.equal(output[1][0]['Recent APP Number'], '#123');
      assert.equal(keys.length, 2);
      assert.notEqual(keys[0], keys[1]);
      const denied: any = await generateApplicationsReport(
        undefined,
        { input },
        { ...context, session: null },
        {} as any
      );
      assert.equal(denied.ok, false);
      model.findFirst = async () => null as any;
      await generateApplicationsReport(undefined, { input }, context, {} as any);
      assert.equal(output[2].length, 0);
      assert.equal(queries.length, 2);
    } finally {
      s3.serverUploadToS3 = originalUpload;
      s3.getSignedUrlForS3 = originalSigned;
    }
    assert.ok(directories.every(directory => !fs.existsSync(directory)));
  } finally {
    if (originalTimeZone === undefined) delete process.env.NEXT_PUBLIC_LOCAL_TIMEZONE;
    else process.env.NEXT_PUBLIC_LOCAL_TIMEZONE = originalTimeZone;
    (fs.promises as any).mkdtemp = originalMkdtemp;
    (fs.promises as any).open = originalOpen;
  }
}
