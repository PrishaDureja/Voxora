import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzeFeedback, submitFeedback, getSuggestions, addSuggestion, getPolls, votePoll, upvoteSuggestion } from '../api/feedback'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const DOMAIN_ISSUES = {
  Restaurant: ['Food quality', 'Delay', 'Cleanliness', 'Staff behavior', 'Pricing', 'Noise'],
  Hotel: ['Room quality', 'Cleanliness', 'Staff', 'Facilities', 'Pricing', 'Noise'],
  Hospital: ['Wait time', 'Staff behavior', 'Cleanliness', 'Treatment', 'Billing', 'Facilities'],
  Hostel: ['Cleanliness', 'Facilities', 'Noise', 'Security', 'Staff', 'Room quality'],
  Mess: ['Food quality', 'Hygiene', 'Quantity', 'Variety', 'Timing', 'Staff'],
  Other: ['Service', 'Staff', 'Cleanliness', 'Pricing', 'Facilities', 'Delay'],
}

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'positive' },
  { emoji: '😐', label: 'Okay', value: 'neutral' },
  { emoji: '😞', label: 'Unhappy', value: 'negative' },
]

export default function Feedback() {
  const { user, domain, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('feedback')
  const [mood, setMood] = useState(null)
  const [selectedIssues, setSelectedIssues] = useState([])
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const domainIssues = DOMAIN_ISSUES[domain] || DOMAIN_ISSUES.Other

  const toggleIssue = (issue) => {
    setSelectedIssues(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    )
  }

  const handleAnalyse = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await analyzeFeedback({
        text, domain,
        mood: mood?.value || null,
        selected_issues: selectedIssues.map(i => i.toLowerCase().replace(/ /g, '_'))
      })
      setResult(res.data)
    } catch {
      setError('Analysis failed. Make sure backend is running on port 5002.')
    } finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    try {
      await submitFeedback({
        text, domain,
        user_id: user?.id,
        mood: mood?.value || null,
        selected_issues: selectedIssues.map(i => i.toLowerCase().replace(/ /g, '_'))
      })
      setSubmitted(true)
    } catch {
      setError('Could not save. Try again.')
    }
  }

  const reset = () => {
    setText(''); setResult(null); setSubmitted(false)
    setMood(null); setSelectedIssues([]); setError('')
  }

  const sentimentColors = {
    positive: { bg: 'rgba(16, 185, 129, 0.05)', text: '#059669', border: 'rgba(16, 185, 129, 0.15)' },
    negative: { bg: 'rgba(234, 88, 12, 0.05)', text: 'var(--accent-peach)', border: 'rgba(234, 88, 12, 0.15)' },
  }
  const sc = result ? (sentimentColors[result.sentiment] || sentimentColors.positive) : null

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="elegant-bg" />
      <div className="noise-overlay" />
      <div className="aurora-sweep-1" /><div className="aurora-sweep-2" />
      <Navbar rightContent={
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hi, <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{user?.name}</span></span>
          <button className="btn-secondary" onClick={() => { logoutUser(); navigate('/') }} style={{ padding: '8px 16px', fontSize: '13px' }}>Log out</button>
        </div>
      } />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <span style={pill}>{domain} Portal</span>
            <span style={pill}>Direct Access</span>
          </div>
          <h1 className="heading" style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            Submit <span className="italic-accent">Feedback</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Write your feedback below, and our model will extract the insights.
          </p>

          <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '12px', marginBottom: '3rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            {['feedback', 'suggestions', 'polls'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '12px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: tab === t ? 500 : 400,
                background: tab === t ? 'rgba(8, 145, 178, 0.04)' : 'transparent',
                color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)', transition: 'all 0.2s',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'feedback' && !submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '3rem' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={sectionLabel}>General Sentiment</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {MOODS.map(m => (
                    <button key={m.value} onClick={() => setMood(mood?.value === m.value ? null : m)}
                      style={{
                        flex: 1, padding: '20px 8px', borderRadius: '16px',
                        border: `1px solid ${mood?.value === m.value ? 'var(--accent-cyan)' : 'rgba(0,0,0,0.06)'}`,
                        background: mood?.value === m.value ? 'rgba(8, 145, 178, 0.02)' : '#FFFFFF',
                        cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: mood?.value === m.value ? '0 8px 24px rgba(8, 145, 178, 0.08)' : 'none',
                        transform: mood?.value === m.value ? 'translateY(-4px)' : 'none'
                      }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px', filter: mood?.value === m.value ? 'drop-shadow(0 4px 10px rgba(8,145,178,0.2))' : 'none' }}>{m.emoji}</div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: mood?.value === m.value ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={sectionLabel}>Topic Focus</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {domainIssues.map(issue => (
                    <button key={issue} onClick={() => toggleIssue(issue)}
                      style={{
                        padding: '10px 20px', borderRadius: '100px', fontSize: '13px', cursor: 'pointer',
                        border: `1px solid ${selectedIssues.includes(issue) ? 'var(--accent-cyan)' : 'rgba(0,0,0,0.06)'}`,
                        background: selectedIssues.includes(issue) ? 'rgba(8, 145, 178, 0.02)' : '#FFFFFF',
                        color: selectedIssues.includes(issue) ? 'var(--accent-cyan)' : 'var(--text-main)',
                        fontWeight: selectedIssues.includes(issue) ? 500 : 400,
                        transition: 'all 0.2s'
                      }}>
                      {issue}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={sectionLabel}>Your Feedback</div>
                <textarea className="input-glass" rows={5}
                  style={{ resize: 'vertical', fontSize: '15px', lineHeight: 1.6 }}
                  placeholder={`Describe your experience at this ${domain?.toLowerCase()}...`}
                  value={text} onChange={e => { setText(e.target.value); setResult(null) }}
                />
              </div>

              {error && <div style={errorBox}>{error}</div>}

              <button onClick={handleAnalyse} disabled={loading || !text.trim()}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '15px', opacity: (!text.trim() || loading) ? 0.6 : 1 }}>
                {loading ? 'Analyzing...' : 'Analyze Feedback'}
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {result && !submitted && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: '3rem', marginTop: '2.5rem' }}>
                <div style={{ ...sectionLabel, color: 'var(--text-main)' }}>Analysis Preview</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <div style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600 }}>
                    {result.sentiment === 'positive' ? 'Positive Sentiment' : 'Negative Sentiment'}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.06)', padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 500 }}>
                    {result.confidence}% confidence
                  </div>
                </div>

                {result.issues?.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Detected Issues</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {result.issues.map(i => <span key={i} style={issuePill}>{i.replace(/_/g, ' ')}</span>)}
                    </div>
                  </div>
                )}

                {result.keywords?.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Extracted Keywords</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {result.keywords.map(k => <span key={k} style={keywordPill}>{k}</span>)}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={handleSubmit} className="btn-primary" style={{ flex: 1.5 }}>Save your experience</button>
                  <button onClick={reset} className="btn-secondary" style={{ flex: 1 }}>Discard</button>
                </div>
              </motion.div>
            )}

            {submitted && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '4rem 3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '1.5rem', opacity: 0.9 }}>✓</div>
                <div className="heading" style={{ fontSize: '28px', fontWeight: 400, color: 'var(--text-main)', marginBottom: '12px' }}>Feedback Saved</div>
                <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem', lineHeight: 1.6 }}>Your feedback has been successfully processed.</div>
                <button onClick={reset} className="btn-secondary" style={{ padding: '14px 40px', fontSize: '14px' }}>Submit another response</button>
              </motion.div>
            )}
          </AnimatePresence>

          {tab === 'suggestions' && <SuggestionsTab domain={domain} />}
          {tab === 'polls' && <PollsTab domain={domain} />}

        </motion.div>
      </div>
    </div>
  )
}

function SuggestionsTab({ domain }) {
  const [suggestions, setSuggestions] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [posted, setPosted] = useState(false)

  useEffect(() => {
    getSuggestions(domain)
      .then(res => setSuggestions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [domain])

  const handleAdd = async () => {
    if (!text.trim()) return
    await addSuggestion({ text, domain })
    setText('')
    setPosted(true)
    getSuggestions(domain).then(res => setSuggestions(res.data))
    setTimeout(() => setPosted(false), 2000)
  }

  const handleUpvote = async (id) => {
    await upvoteSuggestion(id)
    getSuggestions(domain).then(res => setSuggestions(res.data))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <div style={sectionLabel}>Add a suggestion</div>
        <textarea className="input-glass"
          style={{ marginBottom: '1.5rem', resize: 'vertical', fontSize: '15px', lineHeight: 1.6 }} rows={3}
          placeholder="Suggest an improvement..."
          value={text} onChange={e => setText(e.target.value)}
        />
        <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          Submit Suggestion
        </button>
        {posted && <div style={{ fontSize: '13px', color: '#16A34A', marginTop: '16px', fontWeight: 500 }}>✓ Suggestion recorded.</div>}
      </div>

      <div style={sectionLabel}>All Suggestions</div>
      {loading && <div style={{ color: 'var(--text-muted)', fontSize: '14px', paddingTop: '1rem' }}>Loading...</div>}
      {!loading && suggestions.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '4rem' }}>
          No suggestions available.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1.5rem' }}>
        {suggestions.map((s, i) => (
          <div key={s.id} className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ fontSize: '14px', color: 'var(--text-main)', flex: 1, lineHeight: 1.6, fontWeight: 400 }}>{s.text}</div>
             <button onClick={() => handleUpvote(s.id)} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.1)', padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>▲ {s.upvotes}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function PollsTab({ domain }) {
  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState({})

  useEffect(() => {
    getPolls(domain)
      .then(res => setPolls(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [domain])

  const handleVote = async (pollId, optionId) => {
    if (voted[pollId]) return
    await votePoll(optionId)
    setVoted(prev => ({ ...prev, [pollId]: optionId }))
    getPolls(domain).then(res => setPolls(res.data))
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading polls...</div>

  if (polls.length === 0) return (
    <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '4rem' }}>
      No active polls yet.
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {polls.map(poll => {
          const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0)
          const hasVoted = voted[poll.id]
          return (
            <div key={poll.id} className="glass-card" style={{ padding: '2.5rem' }}>
              <div className="heading" style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '2rem' }}>
                {poll.question}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {poll.options.map(opt => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
                  return (
                    <div key={opt.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>{opt.text}</span>
                        {hasVoted && <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{pct}%</span>}
                      </div>
                      <div onClick={() => handleVote(poll.id, opt.id)}
                        style={{
                          position: 'relative', height: '10px', background: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: '100px', overflow: 'hidden',
                          cursor: hasVoted ? 'default' : 'pointer',
                          transition: 'all 0.2s',
                        }}>
                        {hasVoted && (
                          <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${pct}%`, background: 'var(--text-main)',
                            borderRadius: '100px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                          }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              {!hasVoted && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '20px' }}>Click an option to vote</div>}
              {hasVoted && <div style={{ fontSize: '13px', color: '#10B981', marginTop: '20px', fontWeight: 500 }}>✓ Vote recorded</div>}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

const pill = { background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)', textTransform: 'uppercase', letterSpacing: '1px' }
const sectionLabel = { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', display: 'block' }
const errorBox = { background: 'rgba(234, 88, 12, 0.05)', color: 'var(--accent-peach)', fontSize: '14px', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(234, 88, 12, 0.1)', marginBottom: '2rem' }
const issuePill = { background: 'rgba(234, 88, 12, 0.05)', color: 'var(--accent-peach)', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(234, 88, 12, 0.1)' }
const keywordPill = { background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)' }