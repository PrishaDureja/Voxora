import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ rightContent }) {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1.25rem 3rem',
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-delicate)'
    }}>
      <div
        onClick={() => navigate('/')}
        className="heading"
        style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ fontSize: '26px' }} className="text-gradient">❈</span>
        Voxora
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {rightContent || (
          <>
            <button style={linkStyle} onClick={() => scrollTo('how-it-works')}>How it Works</button>
            <button style={linkStyle} onClick={() => scrollTo('domains')}>Domains</button>
            <button className="btn-primary" onClick={() => scrollTo('domains')}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  )
}

const linkStyle = { 
  fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', cursor: 'pointer', 
  padding: '6px 12px', border: 'none', background: 'none',
  transition: 'color 0.2s', fontFamily: 'var(--font-body)'
}