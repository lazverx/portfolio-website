export const POSTER_URLS = {
  home: '/posters/home.webp',
  about: '/posters/about.webp',
  resume: '/posters/resume.webp',
  socials: '/posters/socials.webp',
}

const ROUTE_IMPORTERS = {
  about: () => import('../AboutMe'),
  resume: () => import('../ResumePage'),
  socials: () => import('../Socials'),
}

const warmedRoutes = new Set()
const warmedImages = new Set()

export function preloadImage(src) {
  if (!src || warmedImages.has(src)) return
  warmedImages.add(src)
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

export function prefetchRoute(page) {
  if (!page || warmedRoutes.has(page)) return
  warmedRoutes.add(page)

  if (POSTER_URLS[page]) {
    preloadImage(POSTER_URLS[page])
  }

  const importer = ROUTE_IMPORTERS[page]
  if (importer) {
    importer().catch(() => {
      warmedRoutes.delete(page)
    })
  }
}
