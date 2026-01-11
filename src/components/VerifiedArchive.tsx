import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { History, Calendar } from 'lucide-react'

interface Submission {
  id: string
  title: string
  description: string
  contributor_name: string
  media_urls: string[]
  created_at: string
}

export default function VerifiedArchive() {
  const [data, setData] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVerified = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false })
      if (!error) setData(data)
      setLoading(false)
    }
    fetchVerified()
  }, [])

  if (loading) return <div className="p-10 text-center text-green">Loading Verified History...</div>

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-green mb-4">Verified Heritage Archive</h2>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.map((item) => (
            <div key={item.id} className="bg-sand/10 rounded-2xl overflow-hidden border border-gold/20 flex flex-col">
              {item.media_urls && item.media_urls.length > 0 && (
                <div className="w-full h-64 bg-black">
                  {item.media_urls[0].includes('youtube') ? (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${item.media_urls[0].split('v=')[1] || item.media_urls[0].split('/').pop()}`}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img src={item.media_urls[0]} className="w-full h-full object-cover" alt={item.title} />
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold mb-2">
                  <Calendar size={14}/>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {new Date(item.created_at).getFullYear()}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-brown mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>
                <div className="pt-4 border-t border-gold/10 flex justify-between items-center text-sm italic text-green">
                  <span>Contributed by: {item.contributor_name}</span>
                  <History size={18} className="opacity-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
