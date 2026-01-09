import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'ha'>('en')

  useEffect(() => {
    // Load saved language
    const saved = localStorage.getItem('birinbolawa_lang')
    if (saved === 'en' || saved === 'ha') {
      setLanguage(saved)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ha' : 'en'
    setLanguage(newLang)
    localStorage.setItem('birinbolawa_lang', newLang)
    
    // Show alert for now
    const message = newLang === 'en' 
      ? 'Language switched to English' 
      : 'Harshen ya canza zuwa Hausa'
    alert(message)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sand/30 text-brown hover:bg-sand/50 transition group"
      title={`Switch to ${language === 'en' ? 'Hausa' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'HA'}</span>
      <span className="hidden sm:inline text-xs text-brown/70 group-hover:text-brown">
        ({language === 'en' ? 'English' : 'Hausa'})
      </span>
    </button>
  )
}
