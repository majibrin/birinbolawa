import { Shield, History, Calendar, MapPin, User, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Submission {
  id: string
  title: string
  description: string
  category: string
  contributor_name: string
  contributor_age: number | null
  contributor_relation: string
  estimated_period: string
  location_details: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  media_urls: string[]
}

export default function VerifiedArchive() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVerifiedSubmissions()
  }, [])

  const fetchVerifiedSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'oral_history': return <History className="w-5 h-5" />
      case 'photo': return <ImageIcon className="w-5 h-5" />
      case 'document': return <Shield className="w-5 h-5" />
      case 'artifact': return <History className="w-5 h-5" />
      default: return <History className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'oral_history': return 'bg-blue-100 text-blue-800'
      case 'photo': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-green-100 text-green-800'
      case 'artifact': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-16 bg-gradient-to-b from-white to-sand/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green" />
          </div>
          <h1 className="text-4xl font-bold text-green mb-3">
            Verified Heritage Archive
          </h1>
          <p className="text-brown/70 max-w-2xl mx-auto text-lg">
            Browse authenticated historical contributions from Birin Bolawa community members.
            Each submission has been verified by our heritage committee.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green"></div>
            <p className="mt-4 text-brown/70">Loading verified submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <History className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brown mb-2">No Verified Submissions Yet</h3>
            <p className="text-brown/70">Be the first to contribute verified history!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(sub.category)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(sub.category)}`}>
                        {sub.category.replace('_', ' ')}
                      </span>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green" />
                  </div>

                  <h3 className="text-xl font-bold text-brown mb-3 line-clamp-2">
                    {sub.title}
                  </h3>

                  <p className="text-brown/70 mb-4 line-clamp-3">
                    {sub.description}
                  </p>

                  {sub.media_urls && sub.media_urls.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-brown/70 mb-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Includes {sub.media_urls.length} image(s)</span>
                      </div>
                      <div className="flex gap-2">
                        {sub.media_urls.slice(0, 3).map((url, idx) => (
                          <div key={idx} className="w-16 h-16 bg-sand/20 rounded-lg overflow-hidden">
                            <img 
                              src={url} 
                              alt={`Archive ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {sub.media_urls.length > 3 && (
                          <div className="w-16 h-16 bg-sand/30 rounded-lg flex items-center justify-center">
                            <span className="text-brown/70 font-semibold">+{sub.media_urls.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-sand/30">
                    {sub.contributor_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-brown/50" />
                        <span className="text-brown/70">{sub.contributor_name}</span>
                        {sub.contributor_relation && (
                          <span className="px-2 py-0.5 bg-sand/30 rounded text-xs">
                            {sub.contributor_relation}
                          </span>
                        )}
                      </div>
                    )}

                    {sub.estimated_period && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-brown/50" />
                        <span className="text-brown/70">{sub.estimated_period}</span>
                      </div>
                    )}

                    {sub.location_details && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-brown/50" />
                        <span className="text-brown/70">{sub.location_details}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-brown/50">
                        Added {formatDate(sub.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green">
                        <CheckCircle className="w-3 h-3" />
                        ✅ Verified by Heritage Committee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-brown/70">
            Want to contribute?{' '}
            <a href="#archive-form" className="text-green font-semibold hover:underline">
              Submit your own historical materials
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
