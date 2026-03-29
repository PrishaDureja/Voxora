export default function Footer() {
  return (
    <footer style={{ padding: '2rem 3rem', borderTop: '1px solid var(--border-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>© 2026 Voxora - Experience Intelligence</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <span key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            {l}
          </span>
        ))}
      </div>
    </footer>
  )
}