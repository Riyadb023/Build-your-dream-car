/**
 * JSX RUNNER (dev tool)
 * =====================
 * Node can't import .jsx directly, so the test scripts are bundled with
 * esbuild first and then executed. This keeps the harnesses able to import
 * the real application components rather than duplicating them.
 *
 *   node scripts/run.mjs scripts/smoke.mjs [args...]
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'

const [entry, ...args] = process.argv.slice(2)

if (!entry) {
  console.error('usage: node scripts/run.mjs <script.mjs> [args...]')
  process.exit(1)
}

const dir = mkdtempSync(path.join(tmpdir(), 'dcb-'))
const out = path.join(dir, 'bundle.cjs')

try {
  execFileSync(
    'npx',
    [
      'esbuild',
      entry,
      '--bundle',
      '--platform=node',
      '--format=cjs',
      `--outfile=${out}`,
      '--loader:.jsx=jsx',
      '--loader:.css=local-css',
      '--jsx=automatic',
      '--log-level=error',
      // Optional native dep used only by the PNG renderer.
      '--external:@resvg/resvg-js',
    ],
    { stdio: 'inherit' },
  )

  execFileSync('node', [out, ...args], { stdio: 'inherit' })
} catch (err) {
  process.exit(err.status ?? 1)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
