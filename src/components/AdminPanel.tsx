import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Eye, CheckCircle, XCircle, Loader2, Archive } from 'lucide-react'

interface Submission {
  id: string
  contributor_name: string
  title: string
  description: string
  category: string
  status: string
  created_at: string
}

export default function AdminPanel() {
  const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([])
  const [verifiedSubmissions, setVerifiedSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [view, setView] = useState<'pending' | 'verified'>('pending')

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions()
    }
  }, [authenticated, view])

  const handleLogin = () => {
    if (password === 'birinbolawa2026') {
      setAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  async function fetchSubmissions() {
    try {
      setLoading(true)
      
      // Fetch pending submissions
      const { data: pending, error: pendingError } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (pendingError) throw pendingError
      setPendingSubmissions(pending || [])
      
      // Fetch verified submissions
      const { data: verified, error: verifiedError } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'verified')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (verifiedError) throw verifiedError
      setVerifiedSubmissions(verified || [])
      
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: 'verified' | 'rejected') {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh submissions
      await fetchSubmissions()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green to-brown flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-brown mb-6 text-center">
            Admin Access
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-brown/70 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-sand rounded-lg"
                placeholder="Enter admin password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-green text-white font-semibold rounded-lg hover:bg-green/90"
            >
              Access Panel
            </button>
          </div>
        </div>
      </div>
    )
  }

  const submissions = view === 'pending' ? pendingSubmissions : verifiedSubmissions

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green">Admin Panel</h1>
            <p className="text-brown/70">Manage history submissions</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-green/10 text-green rounded-lg hover:bg-green/20"
            >
              Refresh
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 text-brown/70 hover:text-brown"
            >
              Logout
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setView('verified')}
            className={`px-4 py-2 rounded-lg font-medium ${
              view === 'verified'
                ? 'bg-green text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Archive className="inline w-4 h-4 mr-2" />
            Verified ({verifiedSubmissions.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-green" />
            <p className="text-brown/70 mt-2">Loading submissions...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brown uppercase tracking-wider">
                      Contributor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brown uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brown uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brown uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brown uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-brown">
                          {sub.contributor_name || 'Anonymous'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-brown">{sub.title}</div>
                        <div className="text-sm text-brown/60 truncate max-w-xs">
                          {sub.description.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-sand/30 text-brown capitalize">
                          {sub.category?.replace('_', ' ') || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brown/70">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {view === 'pending' ? (
                          <>
                            <button
                              onClick={() => updateStatus(sub.id, 'verified')}
                              className="text-green hover:text-green/80"
                              title="Verify"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateStatus(sub.id, 'rejected')}
                              className="text-red hover:text-red/80"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : null}
                        <button
                          className="text-brown/70 hover:text-brown"
                          title="View Details"
                          onClick={() => alert(`Description:\\n\\n${sub.description}`)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {submissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-brown/70">
                  {view === 'pending' 
                    ? 'No pending submissions to review.' 
                    : 'No verified submissions yet.'}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-brown/60">
          <p>
            <span className="font-semibold">Note:</span> Verified submissions appear in the public "Verified Archive" section on the main site.
          </p>
        </div>
      </div>
    </div>
  )
}
