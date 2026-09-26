// Read-only publication verification. No GitHub or Cloudflare credentials.
import { createHash } from 'node:crypto';
import { lstat, readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

const maxBytes = 25 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

async function main() {
  const { values } = parseArgs({ options: {
    source: { type: 'string' }, site: { type: 'string' },
    plant: { type: 'string' }, timeout: { type: 'string', default: '300' },
  } });
  for (const key of ['site', 'plant']) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values[key] ?? '')) {
      throw new Error(`--${key} must use lowercase letters, digits and hyphens`);
    }
  }
  const seconds = Number(values.timeout);
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 600) {
    throw new Error('--timeout must be between 1 and 600 seconds');
  }
  if (!values.source) throw new Error('--source is required');
  const stat = await lstat(values.source);
  if (!stat.isFile() || stat.size === 0 || stat.size > maxBytes) {
    throw new Error('--source must be a nonempty regular file of at most 25 MiB');
  }
  const expected = hash(await readFile(values.source));
  const url = `https://plants.qlt.co.mz/${values.site}/${values.plant}/`;
  const deadline = performance.now() + seconds * 1000;
  let last = 'No response';
  while (performance.now() < deadline) {
    try {
      const response = await fetch(url, {
        redirect: 'manual',
        headers: {
          'Cache-Control': 'no-cache',
          'User-Agent': 'plant-model-deploy/0.1 (+https://github.com/aqui-ai/proto-link)',
        },
        signal: AbortSignal.timeout(Math.max(1, Math.min(20000, Math.ceil(deadline - performance.now())))),
      });
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > maxBytes) throw new Error('Response exceeds asset size limit');
        chunks.push(chunk);
      }
      const mime = response.headers.get('content-type')?.split(';')[0].trim();
      if (response.status === 200 && mime === 'text/html'
          && hash(Buffer.concat(chunks)) === expected) {
        console.log(`VERIFIED ${url}\nHTTP 200; SHA-256 ${expected}`);
        return;
      }
      last = `HTTP ${response.status}; original HTML not matched`;
    } catch (error) {
      last = `Request failed: ${error.name}`;
    }
    const remaining = deadline - performance.now();
    if (remaining > 0) await delay(Math.min(5000, remaining));
  }
  throw new Error(`NOT VERIFIED ${url}\n${last}`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
