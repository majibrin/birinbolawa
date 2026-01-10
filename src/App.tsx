import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { Home, Archive, Menu, X, Shield, PlusCircle } from 'lucide-react'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import News from './components/News'
import ArchiveForm from './components/ArchiveForm'
import VerifiedArchive from './components/VerifiedArchive'
import AdminPanel from './components/AdminPanel'
import LanguageToggle from './components/LanguageToggle'

function HomePage() {
  return (
    <div className="w-full">
      <header className="min-h-[75vh] bg-green flex flex-col items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <h1 className="text-5xl md:text-8xl font-bold text-gold mb-6 relative z-10 drop-shadow-lg">Birin Bolawa</h1>
        <p className="text-sand text-xl md:text-2xl max-w-2xl mx-auto italic relative z-10">Preserving the Islamic Heritage of Nafada, Gombe State.</p>
        <div className="mt-10 flex gap-4 relative z-10">
           <a href="#archive-form" className="bg-gold text-green px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition">Submit History</a>
           <a href="#verified-archive" className="border-2 border-sand text-sand px-8 py-3 rounded-full font-bold hover:bg-sand/10 transition">Explore Archive</a>
        </div>
      </header>
      <Timeline />
      <Gallery />
      <News />
      <div id="verified-archive"><VerifiedArchive /></div>
      <div id="archive-form" className="pt-20"><ArchiveForm /></div>
    </div>
  )
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <Router>
      <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-sm border-b border-sand/30 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Link to="/" className="hidden sm:block text-green font-black text-xl tracking-tighter">BIRIN BOLAWA</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-green/80 hover:text-green font-bold transition">Home</Link>
            <a href="#verified-archive" className="text-green/80 hover:text-green font-bold transition">Archive</a>
            <Link to="/admin" className="text-gold font-bold hover:text-brown transition flex items-center gap-1"><Shield size={16}/> Admin</Link>
            <a href="#archive-form" className="bg-green text-white px-5 py-2 rounded-full font-bold hover:shadow-lg transition flex items-center gap-2">
              <PlusCircle size={18}/> Submit
            </a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden text-green p-2">
            {navOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`${navOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-500 bg-white border-t border-sand/20`}>
          <div className="flex flex-col p-6 gap-6 items-center">
            <Link to="/" onClick={() => setNavOpen(false)} className="text-green text-xl font-bold">Home</Link>
            <a href="#verified-archive" onClick={() => setNavOpen(false)} className="text-green text-xl font-bold">Archive</a>
            <Link to="/admin" onClick={() => setNavOpen(false)} className="text-gold text-xl font-bold flex items-center gap-2"><Shield/> Admin Panel</Link>
            <a href="#archive-form" onClick={() => setNavOpen(false)} className="w-full text-center bg-green text-white py-4 rounded-xl font-bold shadow-lg">Submit Heritage</a>
          </div>
        </div>
      </nav>

      <div className="pt-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  )
}
