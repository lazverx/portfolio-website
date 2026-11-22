import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const BUCKET = process.env.R2_BUCKET || 'laz-portfolio-media'
const PUBLIC_BASE = 'https://pub-7c7450a65cad41fa9d91885584371a24.r2.dev'

const defaults = {
  twitter: { followers: '51' },
  instagram: { followers: '336' },
  osu: { rank: '40', pp: '22K' },
}

let current = structuredClone(defaults)
try {
  const res = await fetch(`${PUBLIC_BASE}/stats.json`, { cache: 'no-store' })
  if (res.ok) {
    const remote = await res.json()
    current = {
      twitter: { ...defaults.twitter, ...remote.twitter },
      instagram: { ...defaults.instagram, ...remote.instagram },
      osu: { ...defaults.osu, ...remote.osu },
    }
  }
} catch {
  // Use defaults if stats.json does not exist yet
}

const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  const flag = args[i]
  const val = args[i + 1]
  if (!val) continue
  if (flag === '--ig') {
    current.instagram.followers = String(val)
    i++
  } else if (flag === '--x' || flag === '--twitter') {
    current.twitter.followers = String(val)
    i++
  } else if (flag === '--osu-rank') {
    current.osu.rank = String(val)
    i++
  } else if (flag === '--osu-pp') {
    current.osu.pp = String(val)
    i++
  }
}

const tmpFile = path.join(os.tmpdir(), 'laz-portfolio-stats.json')
fs.writeFileSync(tmpFile, JSON.stringify(current, null, 2) + '\n', 'utf8')
console.log('[stats:update] Uploading stats.json ->', JSON.stringify(current))

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const quoteArg = (a) => (/\s/.test(a) ? `"${a}"` : a)
const cmdArgs = [
  'wrangler',
  'r2',
  'object',
  'put',
  `${BUCKET}/stats.json`,
  '--file',
  tmpFile,
  '--content-type',
  'application/json',
  '--cache-control',
  'public, max-age=60',
  '--remote',
]

const res =
  process.platform === 'win32'
    ? spawnSync(`${npxCmd} ${cmdArgs.map(quoteArg).join(' ')}`, { stdio: 'inherit', shell: true })
    : spawnSync(npxCmd, cmdArgs, { stdio: 'inherit' })

fs.rmSync(tmpFile, { force: true })

if (res.error || res.status !== 0) {
  if (res.error) console.error('[stats:update] Error:', res.error.message)
  process.exit(res.status ?? 1)
}

console.log(`[stats:update] Live at ${PUBLIC_BASE}/stats.json (updates within 60s, no redeploy needed!)`)
