const BASE = import.meta.env.BASE_URL

export const POSTER_URLS = {
  home: `${BASE}posters/home.webp`,
  about: `${BASE}posters/about.webp`,
  resume: `${BASE}posters/resume.webp`,
  socials: `${BASE}posters/socials.webp`,
}

const ROUTE_IMPORTERS = {
  about: () => import('../AboutMe'),
  resume: () => import('../ResumePage'),
  sideproj: () => import('../ResumePage'),
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
