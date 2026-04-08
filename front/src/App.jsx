// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Infos from './pages/Infos'
import LanguageSwitcher from './components/ui/LanguageSwitcher'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/infos" element={<Infos />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}


export default App
