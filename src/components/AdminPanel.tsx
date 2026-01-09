import { Shield, CheckCircle, XCircle, Clock, Download, Filter, ArrowLeft, LogOut } from 'lucide-react'
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
  verified_at?: string  // Make this optional
}

export default function AdminPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [dbReady, _setDbReady] = useState(true)

  // Simple authentication for now
  const handleLogin = () => {
    // In production, replace with Supabase Auth
    if (password === 'birinbolawa2024') {
      setAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
      setError(null)
    } else {
      setError('Incorrect password. Contact system administrator.')
    }
  }

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions()
    }
  }, [filter, authenticated])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setSubmissions(data || [])
      setError(null)
    } catch (error: any) {
      console.error('Error fetching submissions:', error)
      setError('Error loading submissions: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'verified' | 'rejected') => {
    try {
      setError(null)
      
      // Check if verified_at column exists by trying a simple update first
      const updateData: any = { status }
      
      // Only add verified_at if status is changing to verified or rejected
      if (status === 'verified' || status === 'rejected') {
        updateData.verified_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', id)

      if (updateError) {
        console.error('Supabase update error:', updateError)
        
        // If error is about verified_at column, try without it
        if (updateError.message.includes('verified_at')) {
          console.log('verified_at column not found, updating without it')
          const { error: retryError } = await supabase
            .from('submissions')
            .update({ status })
            .eq('id', id)
            
          if (retryError) throw retryError
        } else {
          throw updateError
        }
      }

      // Update local state immediately for better UX
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ))
      
      // Refresh data from server to ensure consistency
      setTimeout(() => fetchSubmissions(), 100)
      
      alert(`Submission ${status === 'verified' ? 'verified' : 'rejected'} successfully!`)
    } catch (error: any) {
      console.error('Error updating status:', error)
      setError('Error updating status: ' + error.message)
      alert('Error updating status. Check console for details.')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
      case 'verified':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Unknown</span>
    }
  }

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(submissions, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `birinbolawa-submissions-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error('Error exporting data:', error)
      setError('Error exporting data')
    }
  }

  const logout = () => {
    setAuthenticated(false)
    localStorage.removeItem('admin_auth')
    setSubmissions([])
    setError(null)
  }

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brown/10 to-green/10 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-green/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green" />
            </div>
            <h1 className="text-2xl font-bold text-green mb-2">Heritage Committee Portal</h1>
            <p className="text-brown/70">Enter admin password to continue</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-brown/70 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-sand rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-green text-white font-semibold rounded-lg hover:bg-green/90 transition"
            >
              Login to Dashboard
            </button>
            
            <div className="text-center">
              <Link to="/" className="text-brown/70 hover:text-green text-sm inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back to Home
              </Link>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-sand/30">
            <p className="text-brown/50 text-xs text-center">
              Only authorized heritage committee members should access this portal.
              Contact the system administrator if you need access.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-brown/5 to-green/5 pt-16 md:pt-4">
      <div className="container mx-auto px-4 py-6">
        {/* Database Warning */}
        {!dbReady && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold">Database Schema Notice</p>
            <p className="text-yellow-700 text-sm mt-1">
              The database is missing some columns. Status updates will work, but verification timestamps won't be saved.
              Run the SQL migration in Supabase to add the 'verified_at' column.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 md:p-3 bg-green/10 rounded-full">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-green" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-green">Heritage Committee Dashboard</h1>
                <p className="text-brown/70 text-sm">Review and verify community submissions</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportData}
                className="px-3 md:px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition flex items-center gap-2 text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export Data</span>
                <span className="md:hidden">Export</span>
              </button>
              <button
                onClick={logout}
                className="px-3 md:px-4 py-2 bg-brown text-white rounded-lg hover:bg-brown/90 transition flex items-center gap-2 text-sm md:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
              <Link
                to="/"
                className="px-3 md:px-4 py-2 bg-sand text-brown rounded-lg hover:bg-sand/90 transition flex items-center gap-2 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => setError(null)}
                  className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => fetchSubmissions()}
                  className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {['pending', 'verified', 'rejected', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm ${filter === status ? 'bg-green text-white' : 'bg-sand/30 text-brown hover:bg-sand/50'}`}
              >
                <Filter className="w-3 h-3 md:w-4 md:h-4" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`px-2 py-0.5 text-xs rounded-full ${filter === status ? 'bg-white/20' : 'bg-brown/10'}`}>
                  {submissions.filter(s => status === 'all' || s.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brown/70 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brown/70 text-sm">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'verified').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-brown/70 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(s => s.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green"></div>
              <p className="mt-4 text-brown/70">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <Shield className="w-16 h-16 text-sand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brown mb-2">No submissions found</h3>
              <p className="text-brown/70">No submissions match the current filter.</p>
              <button 
                onClick={() => fetchSubmissions()}
                className="mt-4 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 md:p-6 hover:bg-sand/5 transition">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 md:gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-brown">{sub.title}</h3>
                        <div className="flex-shrink-0">
                          {getStatusBadge(sub.status)}
                        </div>
                      </div>
                      
                      <p className="text-brown/70 mb-4 text-sm md:text-base">{sub.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="text-sm">
                          <span className="text-brown/50">Category: </span>
                          <span className="font-medium text-brown">{sub.category.replace('_', ' ')}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-brown/50">Contributor: </span>
                          <span className="font-medium text-brown">{sub.contributor_name}</span>
                          {sub.contributor_relation && (
                            <span className="ml-2 px-2 py-0.5 bg-sand/30 rounded text-xs text-brown">
                              {sub.contributor_relation}
                            </span>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="text-brown/50">Period: </span>
                          <span className="font-medium text-brown">{sub.estimated_period || 'Not specified'}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-brown/50">Submitted: </span>
                          <span className="font-medium text-brown">{formatDate(sub.created_at)}</span>
                        </div>
                      </div>

                      {sub.media_urls && sub.media_urls.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-brown/50 mb-2">Attached Media ({sub.media_urls.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {sub.media_urls.slice(0, 3).map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 md:w-16 md:h-16 bg-sand/20 rounded-lg overflow-hidden hover:opacity-90 transition flex-shrink-0"
                              >
                                <img 
                                  src={url} 
                                  alt={`Attachment ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = 'https://via.placeholder.com/100x100?text=Image'
                                  }}
                                />
                              </a>
                            ))}
                            {sub.media_urls.length > 3 && (
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-sand/30 rounded-lg flex items-center justify-center">
                                <span className="text-brown/70 font-semibold">+{sub.media_urls.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-brown/70 space-y-1">
                        {sub.location_details && (
                          <p><span className="font-medium">Location:</span> {sub.location_details}</p>
                        )}
                        {sub.contact_info && (
                          <p><span className="font-medium">Contact:</span> {sub.contact_info}</p>
                        )}
                        {sub.contributor_age && (
                          <p><span className="font-medium">Age:</span> {sub.contributor_age}</p>
                        )}
                      </div>
                    </div>

                    {sub.status === 'pending' && (
                      <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateStatus(sub.id, 'verified')}
                          className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition flex items-center justify-center gap-2 flex-1 min-w-[100px]"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Verify</span>
                          <span className="sm:hidden">✓</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to reject this submission?')) {
                              updateStatus(sub.id, 'rejected')
                            }
                          }}
                          className="px-4 py-2 bg-red text-white rounded-lg hover:bg-red/90 transition flex items-center justify-center gap-2 flex-1 min-w-[100px]"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Reject</span>
                          <span className="sm:hidden">✗</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-brown/50 text-sm">
          <p>Only authorized heritage committee members should access this dashboard.</p>
          <p>Total submissions: {submissions.length} | Last updated: {new Date().toLocaleTimeString()}</p>
          <div className="flex gap-2 justify-center mt-2">
            <button 
              onClick={() => fetchSubmissions()}
              className="text-green hover:underline"
            >
              Refresh Data
            </button>
            {!dbReady && (
              <button 
                onClick={() => {
                  alert('Run this SQL in Supabase SQL Editor:\n\nALTER TABLE submissions \nADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;')
                }}
                className="text-yellow-600 hover:underline"
              >
                Fix Database Schema
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
