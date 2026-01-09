import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DebugSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSubmissions()
  }, [])

  const checkSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Debug error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <h3 className="font-bold mb-2">Debug: Submissions in Database</h3>
      <p className="text-sm mb-2">Total: {submissions.length}</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, idx) => (
            <div key={sub.id} className="p-3 bg-white rounded border">
              <p><strong>Title:</strong> {sub.title}</p>
              <p><strong>Status:</strong> {sub.status}</p>
              <p><strong>Media URLs:</strong> {Array.isArray(sub.media_urls) ? sub.media_urls.length : 0}</p>
              {sub.media_urls && Array.isArray(sub.media_urls) && sub.media_urls.length > 0 && (
                <div>
                  <p className="font-semibold mt-2">Image URLs:</p>
                  <ul className="text-xs">
                    {sub.media_urls.map((url: string, i: number) => (
                      <li key={i} className="break-all">
                        {i + 1}. <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">{url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={checkSubmissions}
        className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded"
      >
        Refresh Debug
      </button>
    </div>
  )
}
