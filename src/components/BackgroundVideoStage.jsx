import { useEffect, useRef, useState } from 'react'
import { VIDEO_SOURCES } from 'virtual:media'
import { POSTER_URLS } from '../utils/prefetch'

const ROUTE_TO_KEY = {
  '/': 'home',
  '/about': 'about',
  '/resume': 'resume',
  '/socials': 'socials',
}

function detectInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  return /Instagram|FBAN|FBAV|FB_IAB|Messenger|Line\/|TikTok|BytedanceWebview|Musical_ly|; wv\)/i.test(
    navigator.userAgent,
  )
}

let cachedHevcSupport = null
function supportsHevcHvc1() {
  if (cachedHevcSupport !== null) return cachedHevcSupport
  if (typeof document === 'undefined') return false
  const probe = document.createElement('video')
  const can = probe.canPlayType('video/mp4; codecs="hvc1.1.6.L150.90"')
  // Require "probably" so browsers with partial/unreliable HEVC probing fall back cleanly to H.264
  cachedHevcSupport = can === 'probably'
  return cachedHevcSupport
}

function pickInitialSrc(sceneKey) {
  const entry = VIDEO_SOURCES[sceneKey]
  if (!entry) return ''
  // Inside Instagram / Facebook / TikTok in-app WebViews, use standards-compliant H.264 Level 4.2 directly
  if (detectInAppBrowser() && entry.compat) {
    return entry.compat
  }
  // For HEVC videos (resume, socials), use original lossless hvc1 if supported, else universal H.264
  if (entry.hevc && entry.compat && !supportsHevcHvc1()) {
    return entry.compat
  }
  return entry.primary
}

function VideoLayer({ sceneKey, active, entryReveal }) {
  const sceneRef = useRef(null)
  const slotRef = useRef(null)
  const videoRef = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Mount native <video> imperatively so HTML `muted` + `playsinline` + `webkit-playsinline`
  // attributes exist BEFORE DOM insertion (fixes React #10389 autoplay block in Instagram WebView & iOS Safari)
  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const entry = VIDEO_SOURCES[sceneKey]
    const initialSrc = pickInitialSrc(sceneKey)
    let usingFallback = initialSrc === entry?.compat

    const video = document.createElement('video')
    video.className = 'bg-scene-video'
    video.defaultMuted = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = true
    video.preload = 'auto'
    video.poster = POSTER_URLS[sceneKey]
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('loop', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('x5-playsinline', '')
    video.setAttribute('preload', 'auto')
    video.src = initialSrc

    let gestureActive = false
    let fallbackTimer = null

    const removeGestureListeners = () => {
      if (!gestureActive) return
      gestureActive = false
      window.removeEventListener('click', onUserUnlock, true)
      window.removeEventListener('touchend', onUserUnlock, true)
      window.removeEventListener('keydown', onUserUnlock, true)
    }

    const switchToCompat = () => {
      if (usingFallback || !entry?.compat || entry.compat === video.src) return
      usingFallback = true
      video.src = entry.compat
      video.load()
      if (activeRef.current) tryPlay()
    }

    const tryPlay = () => {
      if (!activeRef.current) return
      video.muted = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          removeGestureListeners()
        }).catch(() => {
          if (gestureActive) return
          gestureActive = true
          // Use click/touchend/keydown (valid activation gestures in iOS WKWebView / Instagram WebView)
          // and keep listeners attached until play() actually resolves.
          window.addEventListener('click', onUserUnlock, { capture: true, passive: true })
          window.addEventListener('touchend', onUserUnlock, { capture: true, passive: true })
          window.addEventListener('keydown', onUserUnlock, { capture: true, passive: true })
        })
      }
    }

    function onUserUnlock() {
      if (!activeRef.current) return
      tryPlay()
    }

    const onReadyToPlay = () => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer)
        fallbackTimer = null
      }
      if (activeRef.current && video.paused) {
        tryPlay()
      }
    }

    const onError = () => {
      switchToCompat()
    }

    const onVisibilityOrShow = () => {
      if (document.visibilityState === 'visible' && activeRef.current && video.paused) {
        tryPlay()
      }
    }

    video.addEventListener('loadedmetadata', onReadyToPlay)
    video.addEventListener('loadeddata', onReadyToPlay)
    video.addEventListener('canplay', onReadyToPlay)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibilityOrShow)
    window.addEventListener('pageshow', onVisibilityOrShow)

    slot.innerHTML = ''
    slot.appendChild(video)
    videoRef.current = video
    video.load()

    if (activeRef.current) {
      tryPlay()
    }

    // Safety fallback: if a primary HEVC or high-bitrate stream stalls with 0 decoded frames
    // (e.g. Windows Chrome without HEVC decoder or restricted WebView), switch to H.264 compat automatically.
    if (!usingFallback && entry?.compat && entry.compat !== entry.primary) {
      fallbackTimer = setTimeout(() => {
        if (video.readyState < 2 || video.videoWidth === 0) {
          switchToCompat()
        }
      }, 4500)
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer)
      removeGestureListeners()
      video.removeEventListener('loadedmetadata', onReadyToPlay)
      video.removeEventListener('loadeddata', onReadyToPlay)
      video.removeEventListener('canplay', onReadyToPlay)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibilityOrShow)
      window.removeEventListener('pageshow', onVisibilityOrShow)
      video.pause()
      video.removeAttribute('src')
      video.load()
      slot.innerHTML = ''
      videoRef.current = null
    }
  }, [sceneKey])

  // Handle route activation / deactivation (pause offscreen scenes, resume active scene)
  useEffect(() => {
    const videoEl = videoRef.current
    const sceneEl = sceneRef.current
    if (!videoEl) return

    if (!active) {
      videoEl.pause()
      if (sceneEl) sceneEl.classList.remove('is-circle-reveal')
      return
    }

    if (entryReveal && sceneEl) {
      sceneEl.classList.remove('is-circle-reveal')
      void sceneEl.offsetWidth
      sceneEl.classList.add('is-circle-reveal')
    }

    videoEl.muted = true
    const playPromise = videoEl.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  }, [active, entryReveal])

  return (
    <div
      ref={sceneRef}
      data-scene={sceneKey}
      className={`bg-scene${active ? ' is-active' : ''}`}
      onAnimationEnd={(e) => e.currentTarget.classList.remove('is-circle-reveal')}
    >
      <img
        className="bg-scene-poster"
        src={POSTER_URLS[sceneKey]}
        alt=""
        decoding="async"
        fetchPriority={sceneKey === 'home' ? 'high' : 'auto'}
      />
      <div ref={slotRef} className="bg-scene-video-slot" />
    </div>
  )
}

export default function BackgroundVideoStage({ pathname }) {
  const activeKey = ROUTE_TO_KEY[pathname] || 'home'
  const [visitedKeys, setVisitedKeys] = useState(() => [activeKey])

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setVisitedKeys((prev) => (prev.includes(activeKey) ? prev : [...prev, activeKey]))
    })
    return () => {
      cancelled = true
    }
  }, [activeKey])

  const keysToRender = visitedKeys.includes(activeKey) ? visitedKeys : [...visitedKeys, activeKey]

  return (
    <div className="bg-stage">
      {keysToRender.map((key) => (
        <VideoLayer
          key={key}
          sceneKey={key}
          active={key === activeKey}
          entryReveal={key === 'resume'}
        />
      ))}
    </div>
  )
}
