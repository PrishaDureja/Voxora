import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginUser } = useAuth()
  const role = location.state?.role || localStorage.getItem('voxora_role') || 'user'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await login({ email: form.email, password: form.password })
      loginUser({
        id: res.data.id,
        name: res.data.name,
        email: form.email,
        role: res.data.role,
        domain: res.data.domain
      })
      navigate(res.data.role === 'admin' ? '/dashboard' : '/feedback')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your email and password.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="elegant-bg" />
      <div className="noise-overlay" />
      <div className="aurora-sweep-1" /><div className="aurora-sweep-2" />
      <Navbar />
      
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }} className="glass-card" style={card}>
          <div style={badge}>{role === 'admin' ? 'Admin Gateway' : 'User Terminal'}</div>
          <h1 className="heading" style={heading}>Welcome Back</h1>
          <p style={sub}>Log in securely to {role === 'admin' ? 'your dashboard' : 'submit feedback'}.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={label}>Email address</label>
              <input className="input-glass" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={label}>Password</label>
              <input className="input-glass" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            {error && <div style={errorStyle}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '12px', padding: '16px', fontSize: '15px' }}>
              {loading ? 'Authenticating...' : 'Sign in to Voxora →'}
            </button>
          </form>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '3rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" state={{ role }} style={{ color: 'var(--accent-cyan)', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const card = { padding: '4.5rem 3.5rem', width: '100%', maxWidth: '460px', borderRadius: '24px' }
const badge = { display: 'inline-block', background: 'rgba(8, 145, 178, 0.05)', color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(8, 145, 178, 0.1)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }
const heading = { fontSize: '32px', fontWeight: 400, marginBottom: '10px', letterSpacing: '-0.5px' }
const sub = { fontSize: '15px', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }
const label = { display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '10px' }
const errorStyle = { background: 'rgba(234, 88, 12, 0.05)', color: 'var(--accent-peach)', fontSize: '13px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(234, 88, 12, 0.1)' }