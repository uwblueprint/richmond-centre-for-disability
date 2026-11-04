# Bounded Reports

Applications and permit-holder exports use ascending primary-key batches of at most 2,000 parents.
The maximum matching root ID is captured first; ordinary later auto-increment inserts are excluded.
This is a live-value export, not a repeatable-read snapshot: concurrent edits/deletions can change
rows while an export runs. Confirm this consistency contract before merging; a point-in-time export
requires a separate design, not a long database transaction held through S3 upload.

Rows retain the existing selected columns and formatting. Application paging IDs are not the CSV's
User ID, which remains the applicant ID. No rows are truncated to a total report limit. Reports have
an explicit stable ID order (the old queries did not specify order).

CSV headers and one batch at a time are spooled into a private temporary directory/file (0700/0600).
Only the completed file is streamed through the existing S3 uploader, and a signed URL is returned
after upload success. Normal query/format/write/upload failure paths close and remove temporary
artifacts; process kill/crash cannot guarantee finally cleanup, so ephemeral-disk/data handling and
disk capacity remain operational considerations. No real report data belongs in Git or CI.

The UUID suffix prevents simultaneous same-user/same-second exports overwriting each other. The
accountant aggregate report is unchanged. Synchronous CSV-to-S3 streaming does not stream an HTTP
response: measure the full export against the router budget, and move to background jobs if the
required dataset cannot reliably complete with headroom. A client timeout does not cancel a query.

## Local Integration Verification

`RCD_REPORT_TEST_DATABASE_URL=postgresql://...@127.0.0.1:PORT/rcd_report_test_NAME node tests/integration/reports.cjs`
checks the actual resolver/Prisma queries against an approved isolated clone with more than 32,767
applications. It also accepts the investigation's `rcd_memory_work` database names. Supply an
explicit loopback URL, not DATABASE_URL or an SSH tunnel to production. These checks do not create
or seed a database. Confirm the destination/container identity separately: a loopback hostname alone
does not prove isolation.

The script forces one connection, verifies a read-only session, stubs uploads/signing, denies JS
network sockets, compares every application paging ID to an independent ID-only reference query, and
parses both CSV outputs without saving or printing records. Only aggregate counts/timing are
printed. The optional private-copy integration is not a CI fixture; CI uses synthetic unit data.
