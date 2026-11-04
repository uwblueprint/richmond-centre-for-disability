import assert from 'assert';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

type Options = {
  dsn?: string;
  environment?: string;
  release?: string;
  sendDefaultPii?: boolean;
  tracesSampleRate?: number;
};

const loadConfig = (target: 'client' | 'server', env: Record<string, string> = {}): Options => {
  let options: Options | undefined;
  const source = fs.readFileSync(path.join(__dirname, `../../sentry.${target}.config.ts`), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  vm.runInNewContext(compiled.outputText, {
    exports: {},
    process: { env: { NODE_ENV: 'production', ...env } },
    require: (name: string) => {
      assert.strictEqual(name, '@sentry/nextjs');
      return { init: (value: Options) => (options = value) };
    },
  });
  assert(options);
  return options;
};

export default async function sentryConfigTests(): Promise<void> {
  const env = {
    SENTRY_DSN: 'server-dsn',
    NEXT_PUBLIC_SENTRY_DSN: 'browser-dsn',
    SENTRY_ENVIRONMENT: 'server-environment',
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: 'browser-environment',
    SENTRY_RELEASE: 'server-release',
    SOURCE_VERSION: 'heroku-commit',
    NEXT_PUBLIC_SENTRY_RELEASE: 'browser-release',
  };
  const server = loadConfig('server', env);
  const client = loadConfig('client', env);
  assert.strictEqual(server.dsn, 'server-dsn');
  assert.strictEqual(client.dsn, 'browser-dsn');
  assert.strictEqual(server.environment, 'server-environment');
  assert.strictEqual(client.environment, 'browser-environment');
  assert.strictEqual(server.release, 'server-release');
  assert.strictEqual(client.release, 'browser-release');
  assert.strictEqual(loadConfig('server', { SOURCE_VERSION: 'sha' }).release, 'sha');
  const publicOnly = loadConfig('server', {
    NEXT_PUBLIC_SENTRY_DSN: 'public',
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: 'staging',
    NEXT_PUBLIC_SENTRY_RELEASE: 'shared',
  });
  assert.strictEqual(publicOnly.dsn, 'public');
  assert.strictEqual(publicOnly.environment, 'staging');
  assert.strictEqual(publicOnly.release, 'shared');
  for (const target of ['client', 'server'] as const) {
    const defaults = loadConfig(target);
    assert.strictEqual(defaults.environment, 'production');
    assert.strictEqual(defaults.dsn, undefined);
    assert.strictEqual(Object.prototype.hasOwnProperty.call(defaults, 'release'), false);
    assert.strictEqual(defaults.sendDefaultPii, false);
    assert.strictEqual(defaults.tracesSampleRate, 0.1);
  }
  assert.strictEqual(loadConfig('client', { SENTRY_DSN: 'private' }).dsn, undefined);
  assert.strictEqual(loadConfig('client', { SENTRY_RELEASE: 'private' }).release, undefined);
}
