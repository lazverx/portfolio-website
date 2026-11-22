import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/resume.css'

const ITEMS = [
  { id: 'i', badge: 'I', title: 'EDUCATION', subtitle: 'University / Coursework', rank: 3 },
  { id: 'ii', badge: 'II', title: 'SKILLS', subtitle: 'Frontend / Design / UI', rank: 4 },
  { id: 'iii', badge: 'III', title: 'PROJECTS', subtitle: 'Featured Work', rank: 5 },
  { id: 'iv', badge: 'IV', title: 'EXPERIENCE', subtitle: 'Internships / Roles', rank: 2 },
]

const EDUCATION_ROWS = [
  { index: '01', title: 'General Education', status: 'Complete' },
  { index: '02', title: 'Computer Science Core', status: 'In Progress' },
  { index: '03', title: 'Elective Track', status: 'Queued' },
  { index: '04', title: 'Capstone Prep', status: 'Pending' },
]

export default function ResumePage() {
  const navigate = useNavigate()
  const [active, setActive] = useState(1)
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

        {active === 0 && (
          <div className="resume-detail-panel">
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">01</div>
              <div className="resume-detail-top-title">EDUCATION LOG</div>
              <div className="resume-detail-top-progress">7/5</div>
            </div>

            <div className="resume-detail-list">
              {EDUCATION_ROWS.map((row) => (
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
                <div className="resume-detail-bullet">- Maintain progress across required classes and supporting work.</div>
                <div className="resume-detail-bullet">- Track portfolio-ready projects tied to coursework and labs.</div>
                <div className="resume-detail-bullet">- Keep materials prepared for internships, research, and review.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="resume-mobile-controls" aria-label="Resume mobile controls">
        <button className="resume-mobile-btn" type="button" onClick={() => navigate(-1)}>
          BACK
        </button>
      </div>
    </div>
  )
}
