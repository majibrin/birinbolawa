import { User, Send, Loader2, Youtube, ImageIcon, Info, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ArchiveForm() {
  const [form, setForm] = useState({
    contributor_name: '',
    contributor_age: '',
    contributor_relation: '',
    contact_info: '',
    title: '',
    description: '',
    category: 'oral_history',
    estimated_period: '',
    location_details: ''
  })

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY)
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Cloudinary Error')
    return data.secure_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let media_urls: string[] = []
      if (youtubeUrl) media_urls.push(youtubeUrl)
      if (imageFile) {
        const url = await uploadToCloudinary(imageFile)
        media_urls.push(url)
      }

      // FIX: Convert empty age string to null so Supabase doesn't crash
      const submissionData = {
        ...form,
        contributor_age: form.contributor_age ? parseInt(form.contributor_age) : null,
        status: 'pending',
        media_urls: media_urls
      }

      const { error } = await supabase.from('submissions').insert([submissionData])

      if (error) throw error
      
      setSubmitted(true)
      setForm({
        contributor_name: '', contributor_age: '', contributor_relation: '',
        contact_info: '', title: '', description: '',
        category: 'oral_history', estimated_period: '', location_details: ''
      })
      setYoutubeUrl(''); setImageFile(null)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-12 bg-gray-50 flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-green text-center mb-8">Submit to Archive</h2>
        
        {submitted && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center font-bold">
            History submitted successfully for review!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-4 border-gold w-full space-y-6">
          {/* Section 1: Contributor */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-green border-b pb-2"><User size={18}/> Contributor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Full Name *" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.contributor_name} onChange={(e)=>setForm({...form, contributor_name: e.target.value})} />
              <input type="number" placeholder="Age" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.contributor_age} onChange={(e)=>setForm({...form, contributor_age: e.target.value})} />
              <input type="text" placeholder="Relation to Story (e.g. Grandson)" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.contributor_relation} onChange={(e)=>setForm({...form, contributor_relation: e.target.value})} />
              <input type="text" placeholder="Contact Phone/Email" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.contact_info} onChange={(e)=>setForm({...form, contact_info: e.target.value})} />
            </div>
          </div>

          {/* Section 2: Media */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-green border-b pb-2"><LinkIcon size={18}/> Media Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                <Youtube className="text-red-600" size={20}/>
                <input type="url" placeholder="YouTube Link" className="bg-transparent flex-1 outline-none text-sm" value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                <ImageIcon className="text-blue-600" size={20}/>
                <input type="file" accept="image/*" className="flex-1 text-xs" onChange={(e)=>setImageFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          </div>

          {/* Section 3: History Details */}
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-green border-b pb-2"><Info size={18}/> History Details</h3>
            <input type="text" required placeholder="Title of the Story/Artifact *" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Estimated Period (e.g. 1920s)" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.estimated_period} onChange={(e)=>setForm({...form, estimated_period: e.target.value})} />
              <input type="text" placeholder="Location Details" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.location_details} onChange={(e)=>setForm({...form, location_details: e.target.value})} />
            </div>
            <textarea required rows={5} placeholder="Describe the history in detail... *" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-gold" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-4 bg-green text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green/90 transition shadow-lg active:scale-95">
            {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {submitting ? 'Submitting to Archive...' : 'Submit Heritage Record'}
          </button>
        </form>
      </div>
    </div>
  )
}
