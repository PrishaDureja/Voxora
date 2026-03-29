export default function CTABand() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ 
      background: '#FFFFFF', 
      borderRadius: '24px', 
      padding: '5rem 3rem', 
      textAlign: 'center', 
      margin: '0 2rem 4rem', 
      border: '1px solid var(--border-muted)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-teal))' }} />
      <h2 className="heading" style={{ fontSize: '40px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-1px' }}>Ready to understand your feedback?</h2>
      <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>Start analysing in seconds — no complex setup required. Let our deep models do the work.</p>
      <button onClick={scrollToTop} className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
        Get Started Free →
      </button>
    </div>
  )
}