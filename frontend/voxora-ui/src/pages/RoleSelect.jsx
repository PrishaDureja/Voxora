import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { MessageSquare, LineChart } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function RoleSelect() {
  const navigate = useNavigate()
  const { domain } = useAuth()

  const choose = (role) => {
    localStorage.setItem('voxora_role', role)
    navigate('/login', { state: { role } })
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="elegant-bg" />
      <div className="noise-overlay" />
      <div className="aurora-sweep-1" /><div className="aurora-sweep-2" />
      
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={badge}>Selected Domain: <span style={{ fontWeight: 600 }}>{domain}</span></div>
          <h1 className="heading" style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '1rem' }}>
            Choose Your <span className="italic-accent" style={{ color: 'var(--accent-cyan)' }}>Path</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 400 }}>Help us tailor exactly what you need.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '640px', width: '100%' }}>
          {[
            { role: 'user', icon: <MessageSquare strokeWidth={1.5} size={28} />, title: 'I want to give feedback', desc: 'Share your genuine experience anonymously.' },
            { role: 'admin', icon: <LineChart strokeWidth={1.5} size={28} />, title: 'I manage this place', desc: 'Analyze deep AI-generated sentiments from your customers.' },
          ].map((r, i) => (
            <motion.div key={r.role}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              onClick={() => choose(r.role)}
              className="glass-card flex-col items-center"
              style={{ cursor: 'pointer', textAlign: 'center', padding: '3.5rem 2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.08)', color: 'var(--accent-cyan)', margin: '0 auto 1.5rem' }}>
                {r.icon}
              </div>
              <div className="heading" style={{ fontSize: '20px', fontWeight: 500, marginBottom: '12px' }}>{r.title}</div>
              <div style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4rem', textAlign: 'center' }}
        >
          New here? You'll create your secure account on the next screen.
        </motion.p>
      </div>
    </div>
  )
}

const badge = { display: 'inline-block', background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: 500, padding: '4px 14px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }