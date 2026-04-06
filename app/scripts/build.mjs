import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(scriptDir, '..');
const symlinkRoot = '/tmp/legends-detailer-build';
const buildDir = resolve(symlinkRoot, 'legends-ops-app');

rmSync(symlinkRoot, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });

for (const entry of [
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'next-env.d.ts',
  '.env.example',
]) {
  const source = resolve(appDir, entry);
  if (existsSync(source)) {
    cpSync(source, resolve(buildDir, entry));
  }
}

for (const dir of ['src', 'public']) {
  const sourceDir = resolve(appDir, dir);
  if (existsSync(sourceDir)) {
    cpSync(sourceDir, resolve(buildDir, dir), { recursive: true });
  }
}

symlinkSync(resolve(appDir, 'node_modules'), resolve(buildDir, 'node_modules'));

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const child = spawn(npmCmd, ['run', 'build:raw'], {
  cwd: buildDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED ?? '1',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
