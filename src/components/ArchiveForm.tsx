<<<<<<< HEAD
import { Upload, User, Calendar, MapPin, Send, Loader2, X, Image as ImageIcon } from 'lucide-react'
import { useState, useRef } from 'react'
=======
import { Upload, User, Calendar, MapPin, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
>>>>>>> vercel/main
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
  
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
<<<<<<< HEAD
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Limit to 5 files, 5MB each
    const validFiles = files.slice(0, 5).filter(file => file.size <= 5 * 1024 * 1024)
    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (submissionId: string): Promise<string[]> => {
    if (uploadedFiles.length === 0) return []
    
    const urls: string[] = []
    setUploadingImages(true)
    
    try {
      for (const file of uploadedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${submissionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from('history-media')
          .upload(fileName, file)
        
        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('history-media')
          .getPublicUrl(fileName)
        
        urls.push(publicUrl)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploadingImages(false)
    }
    
    return urls
  }
=======
>>>>>>> vercel/main

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
<<<<<<< HEAD
      // First insert submission
      const { data: submission, error: submissionError } = await supabase
=======
      const { error } = await supabase
>>>>>>> vercel/main
        .from('submissions')
        .insert([{
          ...form,
          contributor_age: form.contributor_age ? parseInt(form.contributor_age) : null,
<<<<<<< HEAD
          status: 'pending',
          media_urls: [] // Will update after image upload
        }])
        .select()
        .single()
      
      if (submissionError) throw submissionError
      
      // Upload images if any
      let mediaUrls: string[] = []
      if (uploadedFiles.length > 0) {
        mediaUrls = await uploadImages(submission.id)
        
        // Update submission with image URLs
        if (mediaUrls.length > 0) {
          await supabase
            .from('submissions')
            .update({ media_urls: mediaUrls })
            .eq('id', submission.id)
        }
      }
=======
          status: 'pending'
        }])
        .select()
      
      if (error) throw error
>>>>>>> vercel/main
      
      setSubmitted(true)
      setForm({
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
<<<<<<< HEAD
      setUploadedFiles([])
=======
>>>>>>> vercel/main
      
      setTimeout(() => setSubmitted(false), 5000)
      
    } catch (error: any) {
      alert('Error submitting: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-16 bg-gradient-to-b from-brown/10 to-green/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-gold/20 rounded-full mb-4">
            <Upload className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-green mb-2">
            Secure History Archive
          </h2>
          <p className="text-brown max-w-2xl mx-auto">
            Elders and historians: Submit oral history, photos, or documents about Birin Bolawa for verification and preservation.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green/10 border border-green rounded-lg">
            <p className="text-green font-semibold text-center">
<<<<<<< HEAD
              ✅ Submission received with {uploadedFiles.length} image(s)! Our heritage committee will review it.
=======
              ✅ Submission received! Our heritage committee will review it.
>>>>>>> vercel/main
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
<<<<<<< HEAD
          {/* Personal Information - UNCHANGED */}
=======
>>>>>>> vercel/main
          <div className="mb-8">
            <h3 className="text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contributor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-brown/70 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-sand rounded-lg"
                  placeholder="Your name"
                  value={form.contributor_name}
                  onChange={(e) => setForm({...form, contributor_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-brown/70 text-sm mb-2">Age</label>
                <input
                  type="number"
                  className="w-full p-3 border border-sand rounded-lg"
                  placeholder="Optional"
                  value={form.contributor_age}
                  onChange={(e) => setForm({...form, contributor_age: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-brown/70 text-sm mb-2">Relation to Birin Bolawa</label>
                <select 
                  className="w-full p-3 border border-sand rounded-lg"
                  value={form.contributor_relation}
                  onChange={(e) => setForm({...form, contributor_relation: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="descendant">Descendant</option>
                  <option value="resident">Local Resident</option>
                  <option value="researcher">Researcher</option>
                  <option value="historian">Historian</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-brown/70 text-sm mb-2">Contact Email/Phone</label>
                <input
                  type="text"
                  className="w-full p-3 border border-sand rounded-lg"
                  placeholder="For verification follow-up"
                  value={form.contact_info}
                  onChange={(e) => setForm({...form, contact_info: e.target.value})}
                />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Submission Details - UNCHANGED */}
=======
>>>>>>> vercel/main
          <div className="mb-8">
            <h3 className="text-xl font-bold text-brown mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Submission Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-brown/70 text-sm mb-2">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-sand rounded-lg"
                  placeholder="e.g., Story of the Great Mosque Construction"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-brown/70 text-sm mb-2">Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['oral_history', 'photo', 'document', 'artifact'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`p-3 rounded-lg border text-center capitalize ${
                        form.category === cat 
                          ? 'border-gold bg-gold/10 text-brown' 
                          : 'border-sand text-brown/70 hover:border-gold'
                      }`}
                      onClick={() => setForm({...form, category: cat})}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-brown/70 text-sm mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-3 border border-sand rounded-lg"
                  placeholder="Provide detailed information about your submission..."
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brown/70 text-sm mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Estimated Year/Period
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-sand rounded-lg"
                    placeholder="e.g., Early 1900s, 1950s, etc."
                    value={form.estimated_period}
                    onChange={(e) => setForm({...form, estimated_period: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-brown/70 text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (if known)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-sand rounded-lg"
                    placeholder="Specific area in Birin Bolawa"
                    value={form.location_details}
                    onChange={(e) => setForm({...form, location_details: e.target.value})}
                  />
                </div>
              </div>
<<<<<<< HEAD

              {/* NEW: IMAGE UPLOAD SECTION */}
              <div className="border-2 border-dashed border-sand rounded-lg p-6">
                <div className="text-center mb-4">
                  <ImageIcon className="w-12 h-12 text-sand mx-auto mb-2" />
                  <p className="text-brown font-semibold mb-1">
                    Upload Photos/Documents
                  </p>
                  <p className="text-brown/50 text-sm mb-4">
                    Upload up to 5 images (max 5MB each). JPG, PNG, PDF accepted.
                  </p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-green text-white font-semibold rounded-lg hover:bg-green/90 transition"
                  >
                    Select Files
                  </button>
                </div>

                {/* Uploaded files preview */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-brown font-semibold mb-3">Selected Files:</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-sand/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-brown/70" />
                            <div>
                              <p className="text-brown font-medium text-sm">{file.name}</p>
                              <p className="text-brown/50 text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red hover:text-red/80"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-brown/50 text-xs mt-3">
                      {uploadedFiles.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>
=======
>>>>>>> vercel/main
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
<<<<<<< HEAD
              disabled={submitting || uploadingImages}
              className="px-8 py-4 bg-green text-white font-bold rounded-lg hover:bg-green/90 transition flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {(submitting || uploadingImages) ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadingImages ? 'Uploading Images...' : 'Submitting...'}
=======
              disabled={submitting}
              className="px-8 py-4 bg-green text-white font-bold rounded-lg hover:bg-green/90 transition flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
>>>>>>> vercel/main
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit for Verification
                </>
              )}
            </button>
            <p className="text-brown/50 text-sm mt-4">
              All submissions are reviewed by Birin Bolawa heritage committee before being added to the archive.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
