import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts'
import { Mailbox, BarChart3, Lightbulb, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { getDashboard, getPolls, createPoll, getSuggestions } from '../api/feedback'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user, domain, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [polls, setPolls] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')
  const [pollForm, setPollForm] = useState({ question: '', options: ['', ''] })
  const [pollCreated, setPollCreated] = useState(false)
  const [completedActions, setCompletedActions] = useState(new Set())

  useEffect(() => {
    Promise.all([
      getDashboard(domain),
      getPolls(domain),
      getSuggestions(domain)
    ]).then(([d, p, s]) => {
      setData(d.data)
      setPolls(p.data)
      setSuggestions(s.data)
    }).catch(() => setError('Could not load dashboard.')).finally(() => setLoading(false))
  }, [domain])

  const handleCreatePoll = async () => {
    const validOptions = pollForm.options.filter(o => o.trim())
    if (!pollForm.question.trim() || validOptions.length < 2) return
    await createPoll({ question: pollForm.question, options: validOptions, domain })
    setPollCreated(true)
    getPolls(domain).then(res => setPolls(res.data))
    setPollForm({ question: '', options: ['', ''] })
  }

  const positivePct = data ? Math.round((data.positive_count / data.total_count) * 100) || 0 : 0
  const negativePct = data ? 100 - positivePct : 0

  const pieData = [
    { name: 'Positive', value: positivePct, color: '#0891B2' },
    { name: 'Negative', value: negativePct, color: '#EA580C' },
  ]

  const issueData = data?.issue_breakdown
    ? Object.entries(data.issue_breakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name: name.replace(/_/g, ' '), count }))
    : []

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="elegant-bg" />
      <div className="noise-overlay" />
      <div className="aurora-sweep-1" /><div className="aurora-sweep-2" />
      <Navbar rightContent={
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Admin: <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{user?.name}</span></span>
          <button className="btn-secondary" onClick={() => { logoutUser(); navigate('/') }} style={{ padding: '8px 16px', fontSize: '12px' }}>Log out</button>
        </div>
      } />

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <span style={pill}>{domain} Console</span>
          </div>
          <h1 className="heading" style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '0.5rem' }}>
             Dashboard <span className="italic-accent">Overview</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            Overview of sentiment and feedback analytics for your domain.
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: '#FFFFFF', padding: '6px', borderRadius: '12px', marginBottom: '3rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            {['overview', 'feedback feed', 'polls', 'suggestions'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '12px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: tab === t ? 600 : 500,
                background: tab === t ? 'rgba(8, 145, 178, 0.04)' : 'transparent',
                color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)', transition: 'all 0.2s',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {error && <div style={errorBox}>{error}</div>}
          
          {loading && (
            <div style={{ padding: '2rem 0' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                 {[1,2,3].map(i => <div key={i} className="glass-card" style={{ height: '140px', animation: 'skeleton-pulse 1.5s infinite', background: 'rgba(0,0,0,0.02)' }} />)}
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
                 <div className="glass-card" style={{ height: '300px', animation: 'skeleton-pulse 1.5s infinite', background: 'rgba(0,0,0,0.02)' }} />
                 <div className="glass-card" style={{ height: '300px', animation: 'skeleton-pulse 1.5s infinite', background: 'rgba(0,0,0,0.02)' }} />
               </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {!loading && data && tab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
                {[
                  { label: 'Total feedback', value: data.total_count },
                  { label: 'Positive', value: `${positivePct}%` },
                  { label: 'Negative', value: `${negativePct}%` },
                ].map(s => (
                  <div key={s.label} className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>{s.label}</div>
                    <div className="heading" style={{ fontSize: '38px', fontWeight: 400, letterSpacing: '-1px', color: 'var(--text-main)' }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              {data.total_count > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Pie chart */}
                  <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                    <div style={cardLabel}>Sentiment split</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="#fff" strokeWidth={3}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', color: '#1C1917', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#0891B2' }}>●</span> Positive {positivePct}%</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}><span style={{ color: '#EA580C' }}>●</span> Negative {negativePct}%</span>
                    </div>
                  </div>

                  {/* Issue breakdown */}
                  <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                    <div style={cardLabel}>Top Issues Detected</div>
                    {issueData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={issueData} layout="vertical" margin={{ left: 24, right: 24 }}>
                          <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={{ stroke: 'rgba(0,0,0,0.05)' }} tickLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-main)', fontSize: 13, fontWeight: 500 }} width={120} axisLine={{ stroke: 'rgba(0,0,0,0.05)' }} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(8, 145, 178,0.03)' }} contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', color: '#1C1917' }} />
                          <Bar dataKey="count" fill="url(#colorBar)" radius={[0, 4, 4, 0]} barSize={24} />
                          <defs>
                            <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#0891B2" />
                              <stop offset="100%" stopColor="#1C1917" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '3rem' }}>No issues detected yet</div>
                    )}
                  </div>
                </div>
              )}

              {/* NEW TREND AND KEYWORDS ROW */}
              {data.total_count > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Trend Area Chart */}
                  <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                    <div style={cardLabel}>Sentiment Timeline</div>
                    {data.trend && data.trend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0891B2" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'rgba(0,0,0,0.05)' }} tickLine={false} />
                          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', color: '#0F172A' }} />
                          <Area type="monotone" dataKey="positive" stroke="#0891B2" fillOpacity={1} fill="url(#colorPos)" />
                          <Area type="monotone" dataKey="negative" stroke="#EA580C" fillOpacity={1} fill="url(#colorNeg)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '3rem' }}>Not enough timeline data</div>
                    )}
                  </div>

                  {/* Keyword Cloud */}
                  <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
                    <div style={cardLabel}>Keyword Frequency</div>
                    {data.keyword_freq && data.keyword_freq.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'center', height: '240px', alignContent: 'center' }}>
                        {data.keyword_freq.map((kw, i) => {
                          const size = Math.max(12, Math.min(32, 12 + (kw.count * 2)))
                          const opacity = Math.max(0.4, Math.min(1, 0.4 + (kw.count * 0.1)))
                          return (
                            <span key={i} style={{ fontSize: `${size}px`, fontWeight: 600, color: `rgba(15, 23, 42, ${opacity})`, letterSpacing: '-0.5px' }}>
                              {kw.word}
                            </span>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '3rem' }}>No keywords extracted yet</div>
                    )}
                  </div>
                </div>
              )}

              {/* Issue cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <div style={cardLabel}>Top Issue</div>
                  <div className="heading" style={{ fontSize: '24px', fontWeight: 500, marginTop: '12px', color: 'var(--accent-peach)' }}>
                    {data.top_issue ? data.top_issue.replace(/_/g, ' ') : 'None detected'}
                  </div>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <div style={cardLabel}>Secondary Issue</div>
                  <div className="heading" style={{ fontSize: '24px', fontWeight: 500, marginTop: '12px', color: 'var(--accent-cyan)' }}>
                    {data.secondary_issue ? data.secondary_issue.replace(/_/g, ' ') : 'None detected'}
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="glass-card" style={{ background: '#FFFFFF', border: '1px solid rgba(8, 145, 178, 0.1)', padding: '2.5rem', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-cyan)' }} />
                <div style={{ ...cardLabel, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>✨</span> AI Insight Summary
                </div>
                <div className="heading" style={{ fontSize: '20px', color: 'var(--text-main)', lineHeight: 1.6, marginTop: '16px', fontWeight: 400 }}>
                  {data.insight_message}
                </div>
              </div>

              {/* AI ACTION CENTER (THE VIVA "BANGER" FEATURE) */}
              {data.action_items && data.action_items.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--accent-peach)', borderRadius: '50%', animation: 'skeleton-pulse 2s infinite' }} />
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-peach)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Suggested Actions</div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '16px' }}>
                    {data.action_items.map((item) => {
                      const isComplete = completedActions.has(item.id)
                      return (
                        <div key={item.id} className="glass-card" style={{ 
                          padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
                          background: isComplete ? 'rgba(0,0,0,0.02)' : '#FFFFFF',
                          border: isComplete ? '1px solid rgba(0,0,0,0.04)' : item.urgency === 'critical' ? '1px solid rgba(234,88,12,0.2)' : '1px solid rgba(0,0,0,0.06)',
                          opacity: isComplete ? 0.6 : 1, transition: 'all 0.3s'
                        }}>
                          {/* Interactive Completion Button */}
                          <div 
                            onClick={() => {
                              const newSet = new Set(completedActions)
                              isComplete ? newSet.delete(item.id) : newSet.add(item.id)
                              setCompletedActions(newSet)
                            }}
                            style={{ cursor: 'pointer', color: isComplete ? '#10B981' : 'var(--text-muted)', transition: 'color 0.2s', display: 'flex' }}
                          >
                            <CheckCircle2 strokeWidth={1.5} size={28} />
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.issue}</span>
                              {!isComplete && item.urgency === 'critical' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(234,88,12,0.1)', color: 'var(--accent-peach)', padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}><AlertCircle size={10} strokeWidth={2.5}/> Critical</span>}
                              {!isComplete && item.urgency === 'high' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.1)', color: '#D97706', padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}><Clock size={10} strokeWidth={2.5}/> Priority</span>}
                            </div>
                            <div style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: isComplete ? 400 : 500, textDecoration: isComplete ? 'line-through' : 'none' }}>
                              {item.title}
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                             <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-main)' }}>{item.count}</div>
                             <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mentions</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* FEEDBACK FEED TAB */}
          {!loading && data && tab === 'feedback feed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {data.recent_feedback?.length === 0 && (
                <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}><Mailbox size={48} strokeWidth={1} /></div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No Feedback Yet</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Check back soon once users start submitting feedback.</div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.recent_feedback?.map((fb, i) => (
                  <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px',
                          background: fb.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(234, 88, 12, 0.08)',
                          color: fb.sentiment === 'positive' ? '#059669' : 'var(--accent-peach)',
                          border: `1px solid ${fb.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 88, 12, 0.15)'}`
                        }}>
                          {fb.sentiment === 'positive' ? 'Positive' : 'Critical'}
                        </span>
                        {fb.confidence && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{fb.confidence}% lock</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: '#A8A29E' }}>{fb.created_at?.split('T')[0]}</span>
                    </div>
                    <div style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '20px' }}>"{fb.text}"</div>
                    {((fb.issues?.length > 0) || (fb.keywords?.length > 0)) && (
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {fb.issues?.map(issue => <span key={issue} style={issuePill}>{issue.replace(/_/g, ' ')}</span>)}
                        {fb.keywords?.map(k => <span key={k} style={keywordPill}>{k}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* POLLS TAB - ADMIN */}
          {tab === 'polls' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
                <div style={cardLabel}>Create a Poll</div>
                <input
                  className="input-glass"
                  style={{ marginTop: '16px', marginBottom: '16px' }}
                  placeholder="Ask your organization a question..."
                  value={pollForm.question}
                  onChange={e => setPollForm({ ...pollForm, question: e.target.value })}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'auto', gap: '12px', marginBottom: '20px' }}>
                  {pollForm.options.map((opt, i) => (
                    <input key={i} className="input-glass"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={e => {
                        const opts = [...pollForm.options]
                        opts[i] = e.target.value
                        setPollForm({ ...pollForm, options: opts })
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => setPollForm({ ...pollForm, options: [...pollForm.options, ''] })} className="btn-secondary" style={{ flex: 1 }}>+ Option</button>
                  <button onClick={handleCreatePoll} className="btn-primary" style={{ flex: 2 }}>Create Poll</button>
                </div>
                {pollCreated && <div style={{ fontSize: '13px', color: '#059669', marginTop: '16px', fontWeight: 500 }}>✓ Poll created successfully.</div>}
              </div>

              <div>
                <div style={cardLabel}>Active Polls</div>
                
                {polls.length === 0 && (
                  <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', marginTop: '2rem' }}>
                    <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}><BarChart3 size={48} strokeWidth={1} /></div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No Active Polls</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Use the form above to create your first poll.</div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px', marginTop: '2rem' }}>
                  {polls.map(poll => {
                    const total = poll.options.reduce((s, o) => s + o.votes, 0)
                    return (
                      <div key={poll.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div className="heading" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1.5rem' }}>{poll.question}</div>
                        {poll.options.map(opt => {
                          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0
                          return (
                            <div key={opt.id} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{opt.text}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.votes} ({pct}%)</span>
                              </div>
                              <div style={{ height: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--text-main)', borderRadius: '100px', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                              </div>
                            </div>
                          )
                        })}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>{total} total votes</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUGGESTIONS TAB - ADMIN */}
          {tab === 'suggestions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={cardLabel}>Top Suggestions</div>
              
              {suggestions.length === 0 && (
                <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', marginTop: '2rem' }}>
                  <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}><Lightbulb size={48} strokeWidth={1} /></div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No suggestions yet</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Suggestions will appear here once submitted.</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1.5rem' }}>
                {suggestions.map((s, i) => (
                  <div key={s.id} className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="heading" style={{ fontSize: '20px', fontWeight: 500, color: 'var(--accent-cyan)', minWidth: '30px', textAlign: 'center' }}>#{i + 1}</div>
                    <div style={{ flex: 1, fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6 }}>{s.text}</div>
                    <div style={{ background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(8, 145, 178, 0.1)' }}>▲ {s.upvotes}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

const pill = { background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)', textTransform: 'uppercase', letterSpacing: '1px' }
const cardLabel = { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }
const issuePill = { background: 'rgba(234, 88, 12, 0.05)', color: 'var(--accent-peach)', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(234, 88, 12, 0.1)' }
const keywordPill = { background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 500, padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)' }
const errorBox = { background: 'rgba(234, 88, 12, 0.05)', color: 'var(--accent-peach)', fontSize: '14px', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(234, 88, 12, 0.1)', marginBottom: '2rem' }