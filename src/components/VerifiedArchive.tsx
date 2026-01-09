import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Calendar, User, MapPin, FileText, Image as ImageIcon, Eye } from 'lucide-react'

interface VerifiedSubmission {
  id: string
  contributor_name: string
  title: string
  description: string
  category: string
  estimated_period: string
  location_details: string
  media_urls: string[]
  created_at: string
}

export default function VerifiedArchive() {
  const [submissions, setSubmissions] = useState<VerifiedSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchVerifiedSubmissions()
  }, [filter])

  async function fetchVerifiedSubmissions() {
    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('category', filter)
      }

      const { data, error } = await query
      
      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching verified submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryCounts = {
    all: submissions.length,
    oral_history: submissions.filter(s => s.category === 'oral_history').length,
    photo: submissions.filter(s => s.category === 'photo').length,
    document: submissions.filter(s => s.category === 'document').length,
    artifact: submissions.filter(s => s.category === 'artifact').length,
  }

  return (
    <div className="py-16 bg-gradient-to-b from-white to-sand/10">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-gold/20 rounded-full mb-4">
            <FileText className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-3xl font-bold text-green mb-2">
            Verified History Archive
          </h2>
          <p className="text-brown max-w-2xl mx-auto">
            Browse verified historical submissions from the Birin Bolawa community
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['all', 'oral_history', 'photo', 'document', 'artifact'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? 'bg-green text-white'
                  : 'bg-sand/30 text-brown hover:bg-sand/50'
              }`}
            >
              {cat === 'all' ? 'All' : cat.replace('_', ' ')} 
              <span className="ml-2 text-xs opacity-75">
                ({categoryCounts[cat as keyof typeof categoryCounts]})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
            <p className="text-brown/70 mt-2">Loading verified archive...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-2xl">
            <FileText className="w-12 h-12 text-sand/50 mx-auto mb-4" />
            <p className="text-brown/70">
              No verified submissions yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gold/10 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full capitalize">
                    {sub.category?.replace('_', ' ') || 'history'}
                  </span>
                  <span className="text-xs text-brown/50">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-brown mb-3 line-clamp-2">
                  {sub.title}
                </h3>

                <p className="text-brown/70 mb-6 line-clamp-3">
                  {sub.description}
                </p>

                {/* Image Gallery */}
                {sub.media_urls && sub.media_urls.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-4 h-4 text-brown/50" />
                      <span className="text-sm font-medium text-brown">Attached Images:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sub.media_urls.slice(0, 3).map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedImage(url)}
                        >
                          <img
                            src={url}
                            alt={`Attachment ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border border-sand"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition" />
                        </div>
                      ))}
                      {sub.media_urls.length > 3 && (
                        <div className="w-20 h-20 bg-sand/30 rounded-lg flex items-center justify-center">
                          <span className="text-brown/60 text-sm">
                            +{sub.media_urls.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-sand/30">
                  {sub.contributor_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-brown/50" />
                      <span className="text-brown/70">Submitted by: {sub.contributor_name}</span>
                    </div>
                  )}

                  {sub.estimated_period && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-brown/50" />
                      <span className="text-brown/70">Period: {sub.estimated_period}</span>
                    </div>
                  )}

                  {sub.location_details && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-brown/50" />
                      <span className="text-brown/70">Location: {sub.location_details}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-sand/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green font-semibold">
                      ✅ Verified by Heritage Committee
                    </span>
                    {sub.media_urls && sub.media_urls.length > 0 && (
                      <button
                        onClick={() => setSelectedImage(sub.media_urls[0])}
                        className="text-xs text-gold hover:text-gold/80 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View Images
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-brown/60 text-sm">
            {submissions.length} verified submission{submissions.length !== 1 ? 's' : ''} in the archive
          </p>
        </div>
      </div>
    </div>
  )
}
