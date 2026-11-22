import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const MEDIA_FILES = {
  home: 'Mainn.mp4',
  about: 'main1.mp4',
  resume: 'main2.mp4',
  socials: 'main3.mp4',
}

function createMediaPlugin(mediaBaseUrl) {
  const virtualId = 'virtual:media'
  const resolvedVirtualId = `\0${virtualId}`
  let isBuild = false
  let rootDir = process.cwd()

  function resolveLocalMediaFile(filename) {
    const r2Path = path.join(rootDir, 'media-r2', filename)
    if (fs.existsSync(r2Path)) return r2Path
    return path.join(rootDir, 'src', 'assets', filename)
  }

  function createRangeMiddleware() {
    return (req, res, next) => {
      if (!req.url || !req.url.startsWith('/__media__/')) return next()
      const requested = path.basename(decodeURIComponent(req.url.slice('/__media__/'.length).split('?')[0]))
      if (!Object.values(MEDIA_FILES).includes(requested)) {
        res.statusCode = 404
        res.end('Not found')
        return
      }

      const filePath = resolveLocalMediaFile(requested)
      if (!fs.existsSync(filePath)) {
        res.statusCode = 404
        res.end('Not found')
        return
      }

      const stat = fs.statSync(filePath)
      const total = stat.size
      const range = req.headers.range

      res.setHeader('Content-Type', 'video/mp4')
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Cache-Control', 'public, max-age=3600')

      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range)
        const start = match && match[1] ? parseInt(match[1], 10) : 0
        const end = match && match[2] ? Math.min(parseInt(match[2], 10), total - 1) : Math.min(start + 2 * 1024 * 1024 - 1, total - 1)

        if (start >= total || end < start) {
          res.statusCode = 416
          res.setHeader('Content-Range', `bytes */${total}`)
          res.end()
          return
        }

        res.statusCode = 206
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`)
        res.setHeader('Content-Length', end - start + 1)
        fs.createReadStream(filePath, { start, end }).pipe(res)
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Length', total)
      fs.createReadStream(filePath).pipe(res)
    }
  }

  return {
    name: 'portfolio-media-delivery',
    configResolved(config) {
      isBuild = config.command === 'build'
      rootDir = config.root
    },
    configureServer(server) {
      server.middlewares.use(createRangeMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(createRangeMiddleware())
    },
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId
      return null
    },
    load(id) {
      if (id !== resolvedVirtualId) return null

      if (mediaBaseUrl) {
        const base = mediaBaseUrl.replace(/\/+$/, '')
        return `export const VIDEO_URLS = {
  home: ${JSON.stringify(`${base}/${MEDIA_FILES.home}`)},
  about: ${JSON.stringify(`${base}/${MEDIA_FILES.about}`)},
  resume: ${JSON.stringify(`${base}/${MEDIA_FILES.resume}`)},
  socials: ${JSON.stringify(`${base}/${MEDIA_FILES.socials}`)},
};
export const STATS_URL = ${JSON.stringify(`${base}/stats.json`)};\n`
      }

      if (!isBuild) {
        return `export const VIDEO_URLS = {
  home: '/__media__/${MEDIA_FILES.home}',
  about: '/__media__/${MEDIA_FILES.about}',
  resume: '/__media__/${MEDIA_FILES.resume}',
  socials: '/__media__/${MEDIA_FILES.socials}',
};
export const STATS_URL = '';\n`
      }

      return `import home from '/src/assets/${MEDIA_FILES.home}';
import about from '/src/assets/${MEDIA_FILES.about}';
import resume from '/src/assets/${MEDIA_FILES.resume}';
import socials from '/src/assets/${MEDIA_FILES.socials}';
export const VIDEO_URLS = { home, about, resume, socials };
export const STATS_URL = '';\n`
    },
    transformIndexHtml(html) {
      if (!mediaBaseUrl) return html
      let origin = ''
      try {
        origin = new URL(mediaBaseUrl).origin
      } catch {
        return html
      }
      return {
        html,
        tags: [
          {
            tag: 'link',
            attrs: { rel: 'preconnect', href: origin },
            injectTo: 'head-prepend',
          },
          {
            tag: 'link',
            attrs: { rel: 'dns-prefetch', href: origin },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mediaBaseUrl = (env.VITE_MEDIA_BASE_URL || '').trim()

  return {
    base: '/',
    plugins: [react(), createMediaPlugin(mediaBaseUrl)],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('\\react\\')) {
                return 'react-vendor'
              }
            }
          },
        },
      },
    },
  }
})
