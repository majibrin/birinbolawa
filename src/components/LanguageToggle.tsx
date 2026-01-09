import { Globe } from 'lucide-react'
import { useState } from 'react'

// Translation constants (currently unused)
// const translations = {
//   en: {
//     title: "Birin Bolawa Heritage",
//     subtitle: "14th-century Islamic center in Nafada, Gombe",
//     recentEvent: "Recent Event",
//     eventDesc: "HRH Abubakar Shehu Abubakar III (11th Emir of Gombe) visited the royal tomb on January 8, 2026."
//   },
//   ha: {
//     title: "Gado na Birin Bolawa",
//     subtitle: "Cibiyar Musulunci ta ƙarni na 14 a Nafada, Gombe",
//     recentEvent: "Abin da ya faru kwanan nan",
//     eventDesc: "HRH Abubakar Shehu Abubakar III (Sarkin Gombe na 11) ya ziyarci kabarin sarauta a ranar 8 ga Janairu, 2026."
//   }
// }

export default function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'ha'>('en')

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        <Globe className="w-4 h-4 text-green" />
        <button 
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${language === 'en' ? 'bg-green text-white' : 'text-brown hover:bg-sand/20'}`}
        >
          EN
        </button>
        <span className="text-brown/30">|</span>
        <button 
          onClick={() => setLanguage('ha')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${language === 'ha' ? 'bg-green text-white' : 'text-brown hover:bg-sand/20'}`}
        >
          HA
        </button>
      </div>
    </div>
  )
}
