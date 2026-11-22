import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import char1 from './assets/char1.png'
import char2 from './assets/char2.png'
import char3 from './assets/char3.png'
import mainm from './assets/mainm.jpeg'
import mainm2 from './assets/mainm2.jpeg'
import mainf from './assets/mainf.jpeg'
import { useIsMobile } from './hooks/useIsMobile'
import { preloadImage } from './utils/prefetch'
import './styles/showcase-shared.css'
import './styles/about.css'

const CHARS = [char1, char2, char3]
const MAIN_IMAGES = [mainm, mainm2, mainf]

const REVEAL_CONTENT = [
  {
    upper: ['name: Faiz / Laz / Rushi', 'age: 18', 'major: Software Engineering'],
    lower: 'web, backend, security, automation',
  },
  {
    upper: ['huge rhythm gamer, mostly osu!, arcaea, and pjsk.'],
    lower: 'fun fact',
  },
  {
    upper: [
      'studying german for ausbildung, learning cyber security and ctf, building ai agents and automation stuff, and messing around in fl studio.',
    ],
    lower: "what i'm up to",
  },
]

const ROLES = [
  { text: 'LEADER' },
  { text: 'PARTY' },
  { text: 'PARTY' },
]

const ITEMS = [
  { id: 'about', label: 'ABOUT ME', tabLabel: '01 ABOUT' },
  { id: 'funfact', label: 'FUN FACT', tabLabel: '02 FUN FACT' },
  { id: 'currently', label: 'CURRENTLY', tabLabel: '03 NOW' },
]

export default function AboutMe() {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const navigate = useNavigate()
  const isMobileViewport = useIsMobile(768)

  const revealedRef = useRef(revealed)

  useEffect(() => {
    revealedRef.current = revealed
  }, [revealed])

  const handleBarClick = (index) => {
    preloadImage(MAIN_IMAGES[index])
    if (isMobileViewport) {
      setActive(index)
      setRevealed(true)
      return
    }

    setActive(index)
  }

  useEffect(() => {
    preloadImage(MAIN_IMAGES[0])
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    preloadImage(MAIN_IMAGES[active])
  }, [active])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowDown') setActive((i) => Math.min(ITEMS.length - 1, i + 1))
      if (e.key === 'Enter' || e.key === 'ArrowRight') setRevealed(true)
      if (e.key === 'ArrowLeft') {
        if (revealedRef.current) setRevealed(false)
        else navigate(-1)
      }
      if (e.key === 'Escape' || e.key === 'Backspace') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div id="menu-screen" className={`about-page${revealed ? ' is-revealed' : ''}`}>
      {revealed && <div key={`dim-${active}`} className="sc-dim" />}
      {revealed && (
        <div className="sc-mobile-tabs" role="tablist" aria-label="About sections">
          {ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active === idx}
              className={`sc-mobile-tab${active === idx ? ' active' : ''}`}
              onClick={() => {
                preloadImage(MAIN_IMAGES[idx])
                setActive(idx)
              }}
            >
              {item.tabLabel}
            </button>
          ))}
        </div>
      )}
      {revealed && (
        <div key={`panel-${active}`} className={`sc-reveal-panel${mounted ? ' mounted' : ''}`}>
          <div className="sc-reveal-upper-bar">
            {REVEAL_CONTENT[active].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>
                {line}
              </div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">{REVEAL_CONTENT[active].lower}</div>
        </div>
      )}
      {revealed && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-dot" />
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}
      {revealed && (
        <div key={`portrait-${active}`} className={`sc-main-portrait-shell${mounted ? ' mounted' : ''}`}>
          <img
            className="sc-main-portrait"
            src={MAIN_IMAGES[active]}
            alt=""
            decoding="async"
          />
        </div>
      )}

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? ' active' : ''}${mounted ? ' mounted' : ''}`}
            onClick={() => handleBarClick(i)}
            onMouseEnter={() => {
              setActive(i)
              preloadImage(MAIN_IMAGES[i])
            }}
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
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`sc-footer${mounted ? ' mounted' : ''}`}>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↑↓</span>
          <span>SELECT</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">↵</span>
          <span>REVEAL</span>
        </div>
        <div className="sc-footer-row">
          <span className="sc-footer-key">ESC</span>
          <span>BACK</span>
        </div>
      </div>

      <div className="sc-mobile-controls" aria-label="About mobile controls">
        <button className="sc-mobile-btn" type="button" onClick={() => (revealed ? setRevealed(false) : navigate(-1))}>
          ◄ BACK
        </button>
        <button className="sc-mobile-btn primary" type="button" onClick={() => setRevealed((prev) => !prev)}>
          {revealed ? 'HIDE' : 'REVEAL'}
        </button>
      </div>
    </div>
  )
}
