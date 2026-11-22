import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './styles/resume.css'

const ITEMS = [
  {
    id: 'i',
    badge: 'I',
    title: 'EDUCATION',
    subtitle: 'Vocational School / Software Eng.',
    rank: 4,
    detail: {
      index: '01',
      title: 'EDUCATION',
      progress: 'FINAL YR',
      rows: [
        { index: '01', title: 'Software Engineering', status: 'In Progress' },
        { index: '02', title: 'Tech Internship (4 mos)', status: 'Complete' },
        { index: '03', title: 'Junior Coder Exam', status: 'In Progress' },
        { index: '04', title: 'German (Ausbildung)', status: 'Ongoing' },
      ],
      bullets: [
        '- Vocational high school, Software Engineering.',
        '- Finished a 4-month internship (Jul to Nov 2026).',
        '- Studying German for Ausbildung.',
      ],
    },
  },
  {
    id: 'ii',
    badge: 'II',
    title: 'SKILLS',
    subtitle: 'Full-Stack / AI / n8n / CyberSec',
    rank: 5,
    detail: {
      index: '02',
      title: 'SKILLS',
      progress: 'ALL-ROUND',
      rows: [
        { index: '01', title: 'JS, TS, React, Next, Vite, CSS', status: 'Frontend' },
        { index: '02', title: 'Python, FastAPI, Node, Laravel', status: 'Backend' },
        { index: '03', title: 'AI Agents, n8n, RAG, APIs', status: 'AI / Auto' },
        { index: '04', title: 'CTF, AppSec, Linux, Docker', status: 'Security' },
      ],
      bullets: [
        '- Frontend & backend web apps with React, Python, JS/TS, Laravel, Postgres, and Redis.',
        '- AI agents, LLM tool calling, memory systems, and n8n workflows.',
        '- Web/API security audits, CTF challenges, Nginx, Docker, and Linux servers.',
      ],
    },
  },
  {
    id: 'iii',
    badge: 'III',
    title: 'PROJECTS',
    subtitle: 'CyberSec / CTF / AI Agents / n8n',
    rank: 5,
    detail: {
      index: '03',
      title: 'PROJECTS',
      progress: '4 CORE',
      rows: [
        { index: '01', title: 'Arthur AI Agent', status: 'Python' },
        { index: '02', title: 'AppSec & CTF Labs', status: 'Security' },
        { index: '03', title: 'n8n AI Workflows', status: 'Automation' },
        { index: '04', title: 'Readify & Web Apps', status: 'Full-Stack' },
      ],
      bullets: [
        '- Arthur AI: self-hosted agent using FastAPI, Docker, WhatsApp Cloud API, and 3-tier memory.',
        '- Security & CTF: web/crypto CTF labs, auth & API vuln audits, server hardening scripts.',
        '- n8n & Web: webhook/voice/KYC automations, Readify AI library, and Win32 tools.',
      ],
    },
  },
  {
    id: 'iv',
    badge: 'IV',
    title: 'EXPERIENCE',
    subtitle: 'Clevio Technical Team',
    rank: 4,
    detail: {
      index: '04',
      title: 'EXPERIENCE',
      progress: '4 MOS',
      rows: [
        { index: '01', title: 'Clevio Technical Team', status: 'Jul-Nov 26' },
        { index: '02', title: 'AI Agent & Meta API', status: 'Shipped' },
        { index: '03', title: 'Backend Security Audit', status: '10 Fixes' },
        { index: '04', title: 'n8n & Automation', status: 'Shipped' },
      ],
      bullets: [
        '- 4-month internship on the Clevio Technical Team.',
        '- Built WhatsApp Embedded Signup, Coexistence Mode, and AI memory systems.',
        '- Patched 10 backend security bugs and built n8n + Win32 automation tools.',
      ],
    },
  },
]

export default function ResumePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialTab =
    typeof location.state?.tab === 'number' && location.state.tab >= 0 && location.state.tab < ITEMS.length
      ? location.state.tab
      : 0
  const [active, setActive] = useState(initialTab)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowDown') setActive((i) => Math.min(ITEMS.length - 1, i + 1))
      if (e.key === 'ArrowLeft' || e.key === 'Escape' || e.key === 'Backspace') navigate(-1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const detail = ITEMS[active].detail

  return (
    <div id="menu-screen" className="resume-page">
      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? ' mounted' : ''}`}>LIST</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? ' active' : ''}${mounted ? ' mounted' : ''}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="resume-detail-panel" key={ITEMS[active].id}>
          <div className="resume-detail-top">
            <div className="resume-detail-top-index">{detail.index}</div>
            <div className="resume-detail-top-title">{detail.title}</div>
            <div className="resume-detail-top-progress">{detail.progress}</div>
          </div>

          <div className="resume-detail-list">
            {detail.rows.map((row) => (
              <div className="resume-detail-row" key={row.index}>
                <div className="resume-detail-row-index">{row.index}</div>
                <div className="resume-detail-row-title">{row.title}</div>
                <div className="resume-detail-status">{row.status}</div>
              </div>
            ))}
          </div>

          <div className="resume-detail-bottom">
            <div className="resume-detail-bottom-title">DETAILS</div>
            <div className="resume-detail-bullets">
              {detail.bullets.map((bullet) => (
                <div className="resume-detail-bullet" key={bullet}>
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="resume-mobile-controls" aria-label="Resume mobile controls">
        <button className="resume-mobile-btn" type="button" onClick={() => navigate(-1)}>
          ◄ BACK
        </button>
      </div>
    </div>
  )
}
