import { useEffect, useRef, useState } from 'react'
import { VIDEO_URLS } from 'virtual:media'
import { POSTER_URLS } from '../utils/prefetch'

const ROUTE_TO_KEY = {
  '/': 'home',
  '/about': 'about',
  '/resume': 'resume',
  '/socials': 'socials',
}

function VideoLayer({ sceneKey, active, entryReveal }) {
  const sceneRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const videoEl = videoRef.current
    const sceneEl = sceneRef.current
    if (!videoEl) return

    if (active) {
      if (entryReveal && sceneEl) {
        sceneEl.classList.remove('is-circle-reveal')
        void sceneEl.offsetWidth
        sceneEl.classList.add('is-circle-reveal')
      }
      const playPromise = videoEl.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {})
      }
    } else {
      videoEl.pause()
      if (sceneEl) {
        sceneEl.classList.remove('is-circle-reveal')
      }
    }
  }, [active, entryReveal])

  return (
    <div
      ref={sceneRef}
      className={`bg-scene${active ? ' is-active' : ''}`}
      onAnimationEnd={(e) => e.currentTarget.classList.remove('is-circle-reveal')}
      aria-hidden="true"
    >
      <img
        className="bg-scene-poster"
        src={POSTER_URLS[sceneKey]}
        alt=""
        decoding="async"
        fetchPriority={sceneKey === 'home' ? 'high' : 'auto'}
      />
      <video
        ref={videoRef}
        className={`bg-scene-video${ready ? ' is-ready' : ''}`}
        src={VIDEO_URLS[sceneKey]}
        autoPlay={active}
        loop
        muted
        playsInline
        preload="auto"
        onPlaying={() => setReady(true)}
        onLoadedData={() => setReady(true)}
      />
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
    <div className="bg-stage" aria-hidden="true">
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
