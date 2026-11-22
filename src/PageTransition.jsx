import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './styles/transitions.css'

const DEFAULT_BLOCKS = ['#0d1a3a', '#1a6aff', '#7dd4fc']

const ABOUT_PANELS = [
  { color: '#00184c', top: '-12vh', left: '-18vw', width: '86vw', delay: 0 },
  { color: '#53edff', top: '24vh', left: '-10vw', width: '72vw', delay: 0.05 },
  { color: '#ffffff', top: '58vh', left: '-14vw', width: '82vw', delay: 0.1 },
]

const RESUME_CARDS = [
  { top: '14vh', color: '#0f1760', delay: 0 },
  { top: '31vh', color: '#7ff6ff', delay: 0.05 },
  { top: '48vh', color: '#ffffff', delay: 0.1 },
  { top: '65vh', color: '#0f1760', delay: 0.15 },
]

const SOCIALS_STRIPES = [
  { color: '#00184c', left: '72vw', width: '24vw', delay: 0 },
  { color: '#00dff7', left: '80vw', width: '14vw', delay: 0.06 },
  { color: '#ffffff', left: '88vw', width: '8vw', delay: 0.12 },
]

const OVERLAY_DURATION_MS = {
  default: 600,
  about: 660,
  resume: 780,
  socials: 720,
}

function TransitionOverlay({ variant }) {
  if (variant === 'about') {
    return ABOUT_PANELS.map((panel, i) => (
      <div
        key={i}
        className="pt-layer pt-about-panel"
        style={{
          top: panel.top,
          left: panel.left,
          width: panel.width,
          background: panel.color,
          zIndex: 999 - i,
          animationDelay: `${panel.delay}s`,
        }}
      />
    ))
  }

  if (variant === 'resume') {
    return RESUME_CARDS.map((card, i) => (
      <div
        key={i}
        className="pt-layer pt-resume-card"
        style={{
          top: card.top,
          background: card.color,
          zIndex: 999 - i,
          boxShadow: card.color === '#ffffff' ? '10px 0 0 #d63232' : 'none',
          animationDelay: `${card.delay}s`,
        }}
      />
    ))
  }

  if (variant === 'socials') {
    return SOCIALS_STRIPES.map((stripe, i) => (
      <div
        key={i}
        className="pt-layer pt-socials-stripe"
        style={{
          left: stripe.left,
          width: stripe.width,
          background: stripe.color,
          zIndex: 999 - i,
          animationDelay: `${stripe.delay}s`,
        }}
      />
    ))
  }

  return DEFAULT_BLOCKS.map((color, i) => (
    <div
      key={i}
      className="pt-layer pt-default-block"
      style={{
        background: color,
        zIndex: 999 - i,
        animationDelay: `${i * 0.05}s`,
      }}
    />
  ))
}

function TransitionStage({ children, variant }) {
  const [showOverlay, setShowOverlay] = useState(true)

  useEffect(() => {
    const ms = OVERLAY_DURATION_MS[variant] ?? OVERLAY_DURATION_MS.default
    const timer = setTimeout(() => setShowOverlay(false), ms)
    return () => clearTimeout(timer)
  }, [variant])

  return (
    <div className="pt-root">
      {showOverlay && <TransitionOverlay variant={variant} />}
      <div className="pt-content">{children}</div>
    </div>
  )
}

export default function PageTransition({ children, variant = 'default' }) {
  const location = useLocation()

  return (
    <TransitionStage key={location.pathname} variant={variant}>
      {children}
    </TransitionStage>
  )
}
