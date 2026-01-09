import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import News from './components/News'
import LanguageToggle from './components/LanguageToggle'
import ArchiveForm from './components/ArchiveForm'
import VerifiedArchive from './components/VerifiedArchive'
import AdminPanel from './components/AdminPanel'
import { Shield, Home, Archive, Upload, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from './context/LanguageContext'

function HomePage() {
  const { t } = useLanguage()
  
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-b from-green to-brown pt-20 md:pt-0">
        <main className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="text-3xl md:text-6xl font-bold text-center text-gold mb-4 md:mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-sand text-center mb-8 md:mb-10">
            {t('hero.subtitle')}
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              {t('hero.recent')}
            </h2>
            <p className="text-sand text-sm md:text-base">
              {t('hero.event')}
            </p>
          </div>
        </main>
      </div>

      {/* Timeline */}
      <Timeline />

      {/* Virtual Tour Gallery */}
      <Gallery />

      {/* Community Hub News */}
      <News />

      {/* Verified Archive */}
      <div id="verified-archive">
        <VerifiedArchive />
      </div>

      {/* Archive Form */}
      <div id="archive-form">
        <ArchiveForm />
      </div>
    </>
  )
}

function App() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <Router>
      <div className="relative">
        {/* Top Bar with Language Toggle and Mobile Menu */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-sand/20">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            {/* Language Toggle */}
            <div className="flex-1">
              <LanguageToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-brown text-white p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-wrap gap-2">
              <Link
                to="/admin"
                className="bg-gold text-green px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gold/90 transition"
              >
                <Shield className="w-4 h-4" />
                {t('nav.admin')}
              </Link>

              <Link
                to="/"
                className="bg-brown text-sand px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-brown/90 transition"
              >
                <Home className="w-4 h-4" />
                {t('nav.home')}
              </Link>

              <a
                href="#verified-archive"
                className="bg-green text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-green/90 transition"
              >
                <Archive className="w-4 h-4" />
                {t('nav.archive')}
              </a>

              <a
                href="#archive-form"
                className="bg-white text-green border border-green px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-green hover:text-white transition"
              >
                <Upload className="w-4 h-4" />
                {t('nav.submit')}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sand/20 shadow-xl md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-gold text-green px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gold/90 transition"
              >
                <Shield className="w-4 h-4" />
                {t('nav.admin')}
              </Link>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-brown text-sand px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brown/90 transition"
              >
                <Home className="w-4 h-4" />
                {t('nav.home')}
              </Link>

              <a
                href="#verified-archive"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-green text-white px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green/90 transition"
              >
                <Archive className="w-4 h-4" />
                {t('nav.archive')}
              </a>

              <a
                href="#archive-form"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-white text-green border border-green px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green hover:text-white transition"
              >
                <Upload className="w-4 h-4" />
                {t('nav.submit')}
              </a>
            </div>
          </div>
        )}

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content with proper padding for fixed header */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
