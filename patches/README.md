# Temporary Next Image Stream Backport

This narrowly scoped build-time backport acknowledges Next 12.0.3's internal Writable write
callback, following upstream [#33719](https://github.com/vercel/next.js/pull/33719). Without it, a
missing local resource that ends its response with a body can leave the optimizer and later same-key
requests waiting indefinitely.

`node lib/scripts/patch-next-image.cjs` runs on postinstall and prebuild. It checks the exact Next
version and full original file hash, applies one known replacement atomically, and recognizes only
the exact resulting patched contents as already applied. Any other dependency version/content fails
closed for review. It does not patch live functions or require a runtime monkey patch. No generated
node_modules files are committed.

Maintainer review of carrying this temporary patch is required. It is not a supported-framework or
security upgrade. Removal condition: upgrade to a supported Next/runtime combination, remove the
hooks/script/patch, and pass the built-server lifecycle fixture on the unpatched supported version.
Do not weaken the hash guard to get an upgrade through CI.

Run `yarn test:image-lifecycle` in an isolated environment. The test builds a minimal synthetic-only
Next app, exercises actual HTTP GET/HEAD/error/same-key/cancel paths, and verifies handler
completion. It never loads product auth, Prisma, S3, Shopify, or customer records. The application
unit suite separately verifies idempotency, unexpected contents, and version rejection.
