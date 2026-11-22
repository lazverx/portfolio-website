import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import BackgroundVideoStage from './components/BackgroundVideoStage'
import P3Menu from './P3Menu'
import PageTransition from './PageTransition'
import './App.css'
import './styles/mobile.css'

const AboutMe = lazy(() => import('./AboutMe'))
const ResumePage = lazy(() => import('./ResumePage'))
const Socials = lazy(() => import('./Socials'))

function MenuScreen() {
  const navigate = useNavigate()
  const handleNavigate = (page) => {
    if (page === 'github') {
      window.open('https://github.com/lazverx', '_blank', 'noopener,noreferrer')
      return
    }
    if (page === 'sideproj') {
      navigate('/resume', { state: { tab: 2 } })
      return
    }
    navigate(`/${page}`)
  }
  return (
    <div id="menu-screen">
      <P3Menu onNavigate={handleNavigate} />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <BackgroundVideoStage pathname={location.pathname} />
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <MenuScreen />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition variant="about">
                <AboutMe />
              </PageTransition>
            }
          />
          <Route
            path="/resume"
            element={
              <PageTransition variant="resume">
                <ResumePage />
              </PageTransition>
            }
          />
          <Route
            path="/socials"
            element={
              <PageTransition variant="socials">
                <Socials />
              </PageTransition>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
