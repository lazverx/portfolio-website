import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const bucket = process.argv[2] || process.env.R2_BUCKET
if (!bucket) {
  console.error('Usage: npm run r2:upload -- <bucket-name>')
  console.error('   or: R2_BUCKET=<bucket-name> npm run r2:upload')
  process.exit(1)
}

const rootDir = process.cwd()
const r2Dir = path.join(rootDir, 'media-r2')
const fallbackDir = path.join(rootDir, 'src', 'assets')
const files = [
  'Mainn.mp4',
  'Mainn-compat.mp4',
  'main1.mp4',
  'main2.mp4',
  'main2-h264.mp4',
  'main3.mp4',
  'main3-h264.mp4',
]

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'

for (const file of files) {
  const candidate = path.join(r2Dir, file)
  const filePath = fs.existsSync(candidate) ? candidate : path.join(fallbackDir, file)

  if (!fs.existsSync(filePath)) {
    console.error(`[r2:upload] Missing file: ${filePath}`)
    process.exit(1)
  }

  const sizeMb = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)
  console.log(`\n[r2:upload] Uploading ${file} (${sizeMb} MB) -> r2://${bucket}/${file}`)

  const relFile = path.relative(rootDir, filePath)
  const quoteArg = (a) => (/\s/.test(a) ? `"${a}"` : a)
  const args = [
    'wrangler',
    'r2',
    'object',
    'put',
    `${bucket}/${file}`,
    '--file',
    relFile,
    '--content-type',
    'video/mp4',
    '--cache-control',
    'public, max-age=31536000, immutable',
    '--remote',
  ]

  const res =
    process.platform === 'win32'
      ? spawnSync(`${npxCmd} ${args.map(quoteArg).join(' ')}`, { stdio: 'inherit', shell: true })
      : spawnSync(npxCmd, args, { stdio: 'inherit' })

  if (res.error || res.status !== 0) {
    if (res.error) console.error('[r2:upload] Spawn error:', res.error.message)
    console.error(`[r2:upload] Failed uploading ${file}. Make sure you ran: npx wrangler login`)
    process.exit(res.status ?? 1)
  }
}

console.log('\n[r2:upload] All videos uploaded with 1-year immutable CDN cache headers!')
