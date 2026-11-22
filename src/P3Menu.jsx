import { useState, useEffect, useRef } from 'react'
import { prefetchRoute } from './utils/prefetch'
import './styles/menu.css'

const ITEMS = [
  { id: 'about', label: 'ABOUT ME', page: 'about', fontSize: 80, offsetX: 0, offsetY: 0, skew: -6, skewY: 10 },
  { id: 'resume', label: 'RESUME', page: 'resume', fontSize: 66, offsetX: 20, offsetY: 8, skew: -11, skewY: -10 },
  { id: 'github', label: 'GITHUB LINK', page: 'github', fontSize: 68, offsetX: 8, offsetY: 6, skew: 0, skewY: -4 },
  { id: 'socials', label: 'SOCIALS', page: 'socials', fontSize: 74, offsetX: 16, offsetY: 8, skew: -3, skewY: 5 },
  { id: 'sideproj', label: 'SIDE PROJECTS', page: 'sideproj', fontSize: 56, offsetX: 10, offsetY: 6, skew: -4, skewY: 7 },
]

const clipTriangle = (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`

export default function P3Menu({ onNavigate }) {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const activeRef = useRef(0)
  const onNavigateRef = useRef(onNavigate)

  useEffect(() => {
    activeRef.current = active
    onNavigateRef.current = onNavigate
  }, [active, onNavigate])

  const activate = (idx) => {
    setActive(idx)
    setAnimKey((k) => k + 1)
    prefetchRoute(ITEMS[idx]?.page)
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') {
        const next = Math.max(0, activeRef.current - 1)
        setActive(next)
        setAnimKey((k) => k + 1)
        prefetchRoute(ITEMS[next]?.page)
      }
      if (e.key === 'ArrowDown') {
        const next = Math.min(ITEMS.length - 1, activeRef.current + 1)
        setActive(next)
        setAnimKey((k) => k + 1)
        prefetchRoute(ITEMS[next]?.page)
      }
      if (e.key === 'Enter') {
        onNavigateRef.current?.(ITEMS[activeRef.current].page)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="p3-overlay">
      <div className="p3-name-tag">
        <span>Laz&apos;s</span>
        <span>portfolio</span>
      </div>
      <div className="p3-stripe" />
      <div className="p3-stripe2" />

      <nav className="p3-menu">
        {ITEMS.map((item, i) => {
          const isActive = active === i
          const dist = Math.abs(i - active)
          const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2)
          const estW = item.label.length * item.fontSize * 0.6 + 80
          const estH = item.fontSize * 0.94
          const clip = clipTriangle(estW, estH)

          return (
            <a
              key={item.id}
              href="#"
              className={`p3-row ${isActive ? 'active' : ''} ${mounted ? 'mounted' : ''}`}
              style={{
                marginRight: item.offsetX,
                marginTop: item.offsetY,
                transitionDelay: mounted ? `${i * 55}ms` : '0ms',
              }}
              onClick={(e) => {
                e.preventDefault()
                onNavigate?.(item.page)
              }}
              onMouseEnter={() => activate(i)}
              onFocus={() => activate(i)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="p3-glow" />
              <div
                className="p3-skew-wrap"
                style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
              >
                <div
                  key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                  className={`p3-shadow-tri${isActive ? ' pop' : ''}`}
                  style={{
                    width: estW,
                    height: estH,
                    clipPath: clip,
                  }}
                />
                <div
                  className="p3-highlight"
                  style={{
                    width: estW,
                    height: estH,
                    clipPath: clip,
                    transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                  }}
                />
                <div className="p3-label-wrap" style={{ opacity }}>
                  <span className="p3-label-base p3-label-dark" style={{ fontSize: item.fontSize }}>
                    {item.label}
                  </span>
                  <span
                    className="p3-label-base p3-label-bright"
                    style={{
                      fontSize: item.fontSize,
                      clipPath: clip,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            </a>
          )
        })}
      </nav>

      <div className={`p3-hint ${mounted ? 'mounted' : ''}`}>
        <div className="p3-hint-row">
          <span className="p3-hint-key">↑↓</span>
          <span>NAVIGATE</span>
        </div>
        <div className="p3-hint-row">
          <span className="p3-hint-key">↵</span>
          <span>CONFIRM</span>
        </div>
      </div>
    </div>
  )
}
