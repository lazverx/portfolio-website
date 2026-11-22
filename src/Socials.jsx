import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { STATS_URL } from 'virtual:media'
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
    id: 'twitter',
    label: 'TWITTER',
    handle: '@lazverx',
    href: 'https://x.com/lazverx',
    icon: '🎮',
    barIcon: icon1,
    stats: [
      { tag: 'FOL', value: '51', color: '#9147ff' },
      { tag: 'ID', value: 'LAZ', color: '#bf94ff' },
    ],
    entries: [
      { label: '@lazverx', url: 'https://x.com/lazverx', tag: 'OPEN', value: 'X', isNew: true },
      { label: 'media', url: 'https://x.com/lazverx/media', tag: 'FEED', value: 'MEDIA' },
      { label: 'replies', url: 'https://x.com/lazverx/with_replies', tag: 'FEED', value: 'POSTS' },
    ],
  },
  {
    id: 'instagram',
    label: 'INSTAGRAM',
    handle: '@lazfrust',
    href: 'https://instagram.com/lazfrust',
    icon: '📷',
    barIcon: icon2,
    stats: [
      { tag: 'FOL', value: '336', color: '#e1306c' },
      { tag: 'IG', value: 'MAIN', color: '#f77737' },
    ],
    entries: [
      { label: '@lazfrust', url: 'https://instagram.com/lazfrust', tag: 'OPEN', value: 'IG', isNew: true },
      { label: 'reels', url: 'https://instagram.com/lazfrust/reels', tag: 'FEED', value: 'REELS' },
    ],
  },
  {
    id: 'osu',
    label: 'OSU',
    handle: 'v4rx #40',
    href: 'https://v4rx.me/user/profile.php/?id=106',
    icon: '🎵',
    barIcon: icon3,
    stats: [
      { tag: 'RNK', value: '40', color: '#00f2ea' },
      { tag: 'PP', value: '22K', color: '#ff0050' },
    ],
    entries: [
      { label: 'v4rx profile', url: 'https://v4rx.me/user/profile.php/?id=106', tag: 'RANK', value: '#40', isNew: true },
      { label: 'v4rx leaderboard', url: 'https://v4rx.me/leaderboard', tag: 'PP', value: '22K' },
    ],
  },
]

export default function Socials() {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeInfoBar, setActiveInfoBar] = useState(0)
  const [focus, setFocus] = useState('left')
  const [liveStats, setLiveStats] = useState(null)
  const navigate = useNavigate()
  const isMobileViewport = useIsMobile(768)

  const stateRef = useRef({ active, activeInfoBar, focus })

  useEffect(() => {
    stateRef.current = { active, activeInfoBar, focus }
  }, [active, activeInfoBar, focus])

  useEffect(() => {
    if (!STATS_URL) return
    const controller = new AbortController()
    fetch(STATS_URL, { signal: controller.signal, cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object') setLiveStats(data)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const items = liveStats
    ? ITEMS.map((item) => {
        if (item.id === 'twitter' && liveStats.twitter?.followers != null) {
          return {
            ...item,
            stats: [{ ...item.stats[0], value: String(liveStats.twitter.followers) }, item.stats[1]],
          }
        }
        if (item.id === 'instagram' && liveStats.instagram?.followers != null) {
          return {
            ...item,
            stats: [{ ...item.stats[0], value: String(liveStats.instagram.followers) }, item.stats[1]],
          }
        }
        if (item.id === 'osu' && (liveStats.osu?.rank != null || liveStats.osu?.pp != null)) {
          return {
            ...item,
            stats: [
              { ...item.stats[0], value: String(liveStats.osu.rank ?? item.stats[0].value) },
              { ...item.stats[1], value: String(liveStats.osu.pp ?? item.stats[1].value) },
            ],
          }
        }
        return item
      })
    : ITEMS

  const selectPlatform = (index) => {
    setActive(index)
    setActiveInfoBar(0)
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      const cur = stateRef.current
      if (cur.focus === 'left') {
        if (e.key === 'ArrowUp') {
          setActive((i) => Math.max(0, i - 1))
          setActiveInfoBar(0)
        }
        if (e.key === 'ArrowDown') {
          setActive((i) => Math.min(ITEMS.length - 1, i + 1))
          setActiveInfoBar(0)
        }
        if (e.key === 'ArrowRight') {
          setFocus('right')
          setActiveInfoBar(0)
        }
        if (e.key === 'Enter') window.open(ITEMS[cur.active].href, '_blank', 'noopener,noreferrer')
      } else {
        const entries = ITEMS[cur.active].entries
        if (e.key === 'ArrowUp') setActiveInfoBar((i) => Math.max(0, i - 1))
        if (e.key === 'ArrowDown') setActiveInfoBar((i) => Math.min(entries.length - 1, i + 1))
        if (e.key === 'ArrowLeft') setFocus('left')
        if (e.key === 'Enter') {
          const entry = entries[cur.activeInfoBar] || entries[0]
          if (entry) window.open(entry.url, '_blank', 'noopener,noreferrer')
        }
      }
      if ((e.key === 'ArrowLeft' && cur.focus === 'left') || e.key === 'Escape' || e.key === 'Backspace') {
        navigate(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const currentEntries = items[active].entries

  return (
    <div id="menu-screen" className="socials-page">
      <div className="sc-root" role="navigation">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? ' active' : ''}${mounted ? ' mounted' : ''}`}
            onClick={() => {
              if (active === i) window.open(item.href, '_blank', 'noopener,noreferrer')
              else selectPlatform(i)
            }}
            onMouseEnter={() => selectPlatform(i)}
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
        <div className="sc-mobile-feed-header">
          <span className="sc-mobile-feed-title">▸ {ITEMS[active].label}</span>
          <span className="sc-mobile-feed-count">
            {currentEntries.length} {currentEntries.length === 1 ? 'LINK' : 'LINKS'}
          </span>
        </div>
      )}

      {mounted && (
        <div className="sc-info-panel" key={`panel-${active}`}>
          {currentEntries.map((entry, i) => (
            <div
              className={`sc-info-bar-wrap${activeInfoBar === i ? ' selected' : ''}`}
              key={`bar-${active}-${entry.label}`}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => {
                if (isMobileViewport || activeInfoBar === i) {
                  window.open(entry.url, '_blank', 'noopener,noreferrer')
                  return
                }
                setActiveInfoBar(i)
              }}
              onMouseEnter={() => setActiveInfoBar(i)}
            >
              {entry.isNew && (
                <img className="sc-info-bar-new" src={newsign} alt="" decoding="async" />
              )}
              <div className="sc-info-bar">
                <img className="sc-info-bar-icon" src={ITEMS[active].barIcon} alt="" decoding="async" />
                <span className="sc-info-bar-text">{entry.label}</span>
                <span className="sc-info-bar-box">{entry.tag}</span>
                <span className="sc-info-bar-count">{entry.value}</span>
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
          ◄ BACK
        </button>
        <button
          className="sc-mobile-btn primary"
          type="button"
          onClick={() => window.open(ITEMS[active].href, '_blank', 'noopener,noreferrer')}
        >
          OPEN {ITEMS[active].label} ↗
        </button>
      </div>
    </div>
  )
}
