import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import char1 from './assets/char1.png'
import char2 from './assets/char2.png'
import char3 from './assets/char3.png'
import newsign from './assets/newsign.png'
import icon1 from './assets/icon1.png'
import icon2 from './assets/icon2.png'
import icon3 from './assets/icon3.png'
import { useIsMobile } from './hooks/useIsMobile'
import './styles/showcase-shared.css'
import './styles/socials.css'

const CHARS = [char1, char2, char3]

const ROLES = [
  { text: 'LEADER' },
  { text: 'PARTY' },
  { text: 'PARTY' },
]

const ITEMS = [
  {
    id: 'twitch',
    label: 'TWITTER',
    handle: '@lazverx',
    href: 'https://x.com/lazverx',
    icon: '🎮',
    barIcon: icon1,
    bars: 1,
    newBars: [0],
    counts: ['56'],
    links: ['twitch.tv/videos/2041837265'],
    stats: [
      { tag: 'FOL', value: '51', color: '#9147ff' },
      { tag: 'VWR', value: '042', color: '#bf94ff' },
    ],
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    handle: '@lazfrust',
    href: 'https://instagram.com/lazfrust',
    icon: '📷',
    barIcon: icon2,
    bars: 5,
    newBars: [1, 2],
    counts: ['3.4M', '2.5M', '676K', '412K', '198K'],
    links: [
      'instagram.com/p/C4xQmRrNk2a',
      'instagram.com/p/C3wLpBsOj7f',
      'instagram.com/reel/C2vKoArMi6e',
      'instagram.com/p/C1uJnZqLh5d',
      'instagram.com/reel/C0tImYpKg4c',
    ],
    stats: [
      { tag: 'FOL', value: '66', color: '#e1306c' },
      { tag: 'PST', value: '128', color: '#f77737' },
    ],
  },
  {
    id: 'tiktok',
    label: 'OSU',
    handle: '@yourhandle',
    href: 'https://v4rx.me/user/profile.php/?id=106',
    icon: '🎵',
    barIcon: icon3,
    bars: 7,
    newBars: [0, 3, 5, 6],
    counts: ['5.1M', '3.7M', '2.2M', '1.4M', '831K', '490K', '217K'],
    links: [
      'tiktok.com/@yourhandle/video/7318492016374859054',
      'tiktok.com/@yourhandle/video/7305837261940183342',
      'tiktok.com/@yourhandle/video/7291046385720348974',
      'tiktok.com/@yourhandle/video/7278392047163820334',
      'tiktok.com/@yourhandle/video/7264819203847165742',
      'tiktok.com/@yourhandle/video/7251047382916430126',
      'tiktok.com/@yourhandle/video/7237294018463851822',
    ],
    stats: [
      { tag: 'RNK', value: '40', color: '#00f2ea' },
      { tag: 'PP', value: '22K', color: '#ff0050' },
    ],
  },
]

export default function Socials() {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeInfoBar, setActiveInfoBar] = useState(0)
  const [focus, setFocus] = useState('left')
  const navigate = useNavigate()
  const isMobileViewport = useIsMobile(768)

  const stateRef = useRef({ active, activeInfoBar, focus })

  useEffect(() => {
    stateRef.current = { active, activeInfoBar, focus }
  }, [active, activeInfoBar, focus])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const cur = stateRef.current
      if (cur.focus === 'left') {
        if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
        if (e.key === 'ArrowDown') setActive((i) => Math.min(ITEMS.length - 1, i + 1))
        if (e.key === 'ArrowRight') {
          setFocus('right')
          setActiveInfoBar(0)
        }
        if (e.key === 'Enter') window.open(ITEMS[cur.active].href, '_blank')
      } else {
        const barCount = ITEMS[cur.active].bars
        if (e.key === 'ArrowUp') setActiveInfoBar((i) => Math.max(0, i - 1))
        if (e.key === 'ArrowDown') setActiveInfoBar((i) => Math.min(barCount - 1, i + 1))
        if (e.key === 'ArrowLeft') setFocus('left')
        if (e.key === 'Enter') window.open('https://' + ITEMS[cur.active].links[cur.activeInfoBar], '_blank')
      }
      if ((e.key === 'ArrowLeft' && cur.focus === 'left') || e.key === 'Escape' || e.key === 'Backspace') {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div id="menu-screen" className="socials-page">
      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? ' active' : ''}${mounted ? ' mounted' : ''}`}
            onClick={() => {
              if (active === i) window.open(item.href, '_blank')
              else setActive(i)
            }}
            onMouseEnter={() => setActive(i)}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" decoding="async" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-icon">{item.icon}</div>
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
                <div className="sc-stats">
                  {item.stats.map((s) => (
                    <div className="sc-stat" key={s.tag}>
                      <div className="sc-stat-top">
                        <span className="sc-stat-tag" style={{ color: s.color, borderColor: s.color }}>
                          {s.tag}
                        </span>
                        <span className="sc-stat-num">{s.value}</span>
                      </div>
                      <div className="sc-stat-bars">
                        <div className="sc-stat-bar-color" style={{ background: s.color }} />
                        <div className="sc-stat-bar-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="sc-right-nav" key={active}>
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-label">{ITEMS[active].label}</span>
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}

      {mounted && (
        <div className="sc-info-panel" key={`panel-${active}`}>
          {Array.from({ length: ITEMS[active].bars }).map((_, i) => (
            <div
              className={`sc-info-bar-wrap${activeInfoBar === i ? ' selected' : ''}`}
              key={`bar-${active}-${i}`}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => {
                if (isMobileViewport || activeInfoBar === i) {
                  window.open('https://' + ITEMS[active].links[i], '_blank')
                  return
                }
                setActiveInfoBar(i)
              }}
              onMouseEnter={() => setActiveInfoBar(i)}
            >
              {ITEMS[active].newBars.includes(i) && (
                <img className="sc-info-bar-new" src={newsign} alt="" decoding="async" />
              )}
              <div className="sc-info-bar">
                <img className="sc-info-bar-icon" src={ITEMS[active].barIcon} alt="" decoding="async" />
                <span className="sc-info-bar-text">{ITEMS[active].links[i].slice(0, 10)}...</span>
                <span className="sc-info-bar-box">VIEWS</span>
                <span className="sc-info-bar-count">{ITEMS[active].counts[i]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`sc-footer${mounted ? ' mounted' : ''}`}>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↑↓</span>
          <span>SELECT</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↵</span>
          <span>OPEN</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">ESC</span>
          <span>BACK</span>
        </div>
      </div>

      <div className="sc-mobile-controls" aria-label="Socials mobile controls">
        <button className="sc-mobile-btn" type="button" onClick={() => navigate(-1)}>
          BACK
        </button>
        <button
          className="sc-mobile-btn"
          type="button"
          onClick={() => window.open(ITEMS[active].href, '_blank')}
        >
          OPEN
        </button>
      </div>
    </div>
  )
}
