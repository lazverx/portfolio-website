import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import BackgroundVideoStage from './components/BackgroundVideoStage'
import P3Menu from './P3Menu'
import PageTransition from './PageTransition'
import './App.css'

const AboutMe = lazy(() => import('./AboutMe'))
const ResumePage = lazy(() => import('./ResumePage'))
const Socials = lazy(() => import('./Socials'))

function MenuScreen() {
  const navigate = useNavigate()
  return (
    <div id="menu-screen">
      <P3Menu onNavigate={(page) => navigate(`/${page}`)} />
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
