// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Contact from './pages/Contact'
import Infos from './pages/Infos'
import IntroSection from './components/sections/Intro/IntroSection'
import { MotionConfig } from 'motion/react'
import ProjectsSection from './pages/projects/ProjectsSection'
import GithubActivitySection from './components/sections/GithubActivity/GithubActivitySection'
import { Analytics } from "@vercel/analytics/react"




/**
 * @brief Root component: lays out the fixed UI, the routed pages and the page sections in order.
 * @returns {JSX.Element} The whole application.
 */
function App() {
  return (
    // reducedMotion="user": with the OS setting on, motion keeps fades and drops movement.
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Header />
      <IntroSection />

      <Routes>
        <Route path="/" element={null} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/infos" element={<Infos />} />
      </Routes>
      <ProjectsSection />
      <GithubActivitySection />
      <Contact />

      <Footer />
      <Analytics />

    </BrowserRouter>
    </MotionConfig>
  )
}


export default App
