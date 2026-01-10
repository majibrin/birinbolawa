import { Shield, CheckCircle, XCircle, Clock, Download, Filter, ArrowLeft, LogOut, ExternalLink, Youtube, ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface Submission {
  id: string
  title: string
  description: string
  category: string
  contributor_name: string
  contributor_age: number | null
  contributor_relation: string
  contact_info: string
  estimated_period: string
  location_details: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  media_urls: string[]
  verified_at?: string
}

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
      setError(null)
    } else {
      setError('Incorrect password.')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') setAuthenticated(true)
  }, [])

  useEffect(() => {
    if (authenticated) fetchSubmissions()
  }, [filter, authenticated])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('status', filter)
      const { data, error } = await query
      if (error) throw error
      setSubmissions(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'verified' | 'rejected') => {
    const { error } = await supabase.from('submissions').update({ status, verified_at: new Date().toISOString() }).eq('id', id)
    if (error) alert(error.message)
    else fetchSubmissions()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/10 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-green">
          <h2 className="text-2xl font-bold text-green mb-4 flex items-center gap-2"><Shield/> Admin Login</h2>
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-4" onChange={(e)=>setPassword(e.target.value)} onKeyPress={(e)=>e.key === 'Enter' && handleLogin()}/>
          <button onClick={handleLogin} className="w-full bg-green text-white py-3 rounded-lg font-bold">Access Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-green">Heritage Committee</h1>
            <p className="text-sm text-gray-500">Reviewing {submissions.length} submissions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setFilter('pending')} className={`px-4 py-2 rounded-lg ${filter==='pending'?'bg-green text-white':'bg-white border'}`}>Pending</button>
            <button onClick={()=>setAuthenticated(false)} className="p-2 text-red-600"><LogOut/></button>
          </div>
        </div>

        <div className="space-y-4">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gold">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-brown">{sub.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${sub.status === 'verified' ? 'bg-green/10 text-green' : 'bg-yellow-100 text-yellow-700'}`}>{sub.status}</span>
              </div>
              <p className="text-gray-700 mb-4">{sub.description}</p>
              
              {/* Media Preview Section */}
              {sub.media_urls && sub.media_urls.length > 0 && (
                <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                  {sub.media_urls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="relative group w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                      {url.includes('youtube') ? (
                        <div className="flex items-center justify-center h-full text-red-600"><Youtube size={32}/></div>
                      ) : (
                        <img src={url} className="w-full h-full object-cover" alt="Media" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><ExternalLink size={16}/></div>
                    </a>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                <span>By: {sub.contributor_name} ({sub.contributor_relation})</span>
                {sub.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={()=>updateStatus(sub.id, 'verified')} className="bg-green text-white px-4 py-2 rounded-lg flex items-center gap-1"><CheckCircle size={16}/> Verify</button>
                    <button onClick={()=>updateStatus(sub.id, 'rejected')} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center gap-1"><XCircle size={16}/> Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
