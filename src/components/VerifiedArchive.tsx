import { Shield, History, Calendar, MapPin, User, CheckCircle, Image as ImageIcon, ExternalLink } from 'lucide-react'
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

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
      
      // Process submissions to ensure media_urls is a valid array
      const processedData = (data || []).map(sub => {
        let mediaUrls: string[] = []
        
        if (sub.media_urls) {
          if (Array.isArray(sub.media_urls)) {
            mediaUrls = sub.media_urls.filter(url => url && typeof url === 'string' && url.trim() !== '')
          } else if (typeof sub.media_urls === 'string') {
            // Handle case where media_urls might be stored as a string
            try {
              const parsed = JSON.parse(sub.media_urls)
              if (Array.isArray(parsed)) {
                mediaUrls = parsed.filter(url => url && typeof url === 'string' && url.trim() !== '')
              }
            } catch {
              // If it's not JSON, try to split by comma
              mediaUrls = sub.media_urls.split(',').filter(url => url && url.trim() !== '')
            }
          }
        }
        
        return {
          ...sub,
          media_urls: mediaUrls
        }
      })
      
      console.log('Loaded verified submissions:', processedData) // Debug
      setSubmissions(processedData)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      alert('Error loading verified submissions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
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

  const handleImageError = (url: string) => {
    console.error('Image failed to load:', url)
    setImageErrors(prev => ({ ...prev, [url]: true }))
  }

  const getImageUrl = (url: string) => {
    if (!url) return ''
    
    // Clean the URL
    let cleanUrl = url.trim()
    
    // Fix common Supabase URL issues
    if (cleanUrl.includes('supabase.co')) {
      // Remove any query parameters
      cleanUrl = cleanUrl.split('?')[0]
      
      // Ensure it's the public URL format
      if (cleanUrl.includes('/storage/v1/object/')) {
        // Already a proper Supabase URL
        return cleanUrl
      }
    }
    
    return cleanUrl
  }

  const debugData = () => {
    console.log('=== DEBUG: Verified Submissions ===')
    console.log('Total submissions:', submissions.length)
    
    submissions.forEach((sub, idx) => {
      console.log(`\n--- Submission ${idx + 1} ---`)
      console.log('Title:', sub.title)
      console.log('Status:', sub.status)
      console.log('Media URLs:', sub.media_urls)
      console.log('Media URLs length:', sub.media_urls.length)
      console.log('Media URLs type:', typeof sub.media_urls)
      console.log('Is array:', Array.isArray(sub.media_urls))
      
      if (sub.media_urls.length > 0) {
        console.log('Sample URL:', sub.media_urls[0])
        console.log('Processed URL:', getImageUrl(sub.media_urls[0]))
      }
    })
  }

  return (
    <div className="py-16 bg-gradient-to-b from-white to-sand/10" id="verified-archive">
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
          
          {/* Debug button - remove in production */}
          <button 
            onClick={debugData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Debug Data (Check Console)
          </button>
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
            <button 
              onClick={fetchVerifiedSubmissions}
              className="mt-4 px-6 py-2 bg-green text-white rounded-lg hover:bg-green/90"
            >
              Refresh
            </button>
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

                  {/* IMAGE GALLERY - IMPROVED */}
                  {sub.media_urls && sub.media_urls.length > 0 ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-brown/70 mb-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Includes {sub.media_urls.length} image(s)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sub.media_urls.slice(0, 3).map((url, idx) => {
                          const imageUrl = getImageUrl(url)
                          const hasError = imageErrors[imageUrl]
                          
                          return (
                            <div key={idx} className="relative w-20 h-20 bg-sand/20 rounded-lg overflow-hidden group">
                              {!hasError ? (
                                <>
                                  <img 
                                    src={imageUrl} 
                                    alt={`${sub.title} - Image ${idx + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    onError={() => handleImageError(imageUrl)}
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                  />
                                  <a
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    title="View full image"
                                  >
                                    <div className="bg-white p-1.5 rounded-full">
                                      <ExternalLink className="w-3 h-3 text-brown" />
                                    </div>
                                  </a>
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-sand/30 p-2">
                                  <ImageIcon className="w-6 h-6 text-brown/50 mb-1" />
                                  <span className="text-xs text-brown/70 text-center">Failed to load</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                        {sub.media_urls.length > 3 && (
                          <div className="w-20 h-20 bg-sand/30 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-brown/70 font-semibold text-lg">+{sub.media_urls.length - 3}</span>
                            <span className="text-xs text-brown/50 mt-1">more</span>
                          </div>
                        )}
                      </div>
                      
                      {/* View All Images Button */}
                      <div className="mt-3">
                        <a
                          href={getImageUrl(sub.media_urls[0])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green/10 text-green rounded-lg hover:bg-green/20 text-sm"
                        >
                          <ImageIcon className="w-3 h-3" />
                          View all {sub.media_urls.length} images
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-sand/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-brown/60">
                        <ImageIcon className="w-4 h-4" />
                        <span>No images attached to this submission</span>
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
                        ✅ Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-green-800 font-semibold mb-1">Having trouble viewing images?</h4>
              <p className="text-green-700 text-sm">
                If images aren't displaying, it could be due to: <br/>
                1. The submission may not have attached images <br/>
                2. The images might be still processing <br/>
                3. Check your internet connection <br/>
                4. Click the "Debug Data" button above and check browser console for details
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-brown/70">
            Want to contribute?{' '}
            <a href="#archive-form" className="text-green font-semibold hover:underline">
              Submit your own historical materials
            </a>
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <button 
              onClick={fetchVerifiedSubmissions}
              className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition"
            >
              Refresh Archive
            </button>
            <button 
              onClick={debugData}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Debug Images
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
