import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
}

export default function Hero() {
  const scrollToDomains = () => {
    document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      padding: '6rem 2rem 0', position: 'relative', zIndex: 1, overflow: 'hidden'
    }}>
      
      <motion.p
        style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}
        variants={fadeUp} initial="hidden" animate="show" custom={0}
      >
        Voxora Insights
      </motion.p>

      <motion.h1
        className="heading"
        style={{ fontSize: '76px', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-2px', marginBottom: '1.5rem', maxWidth: '900px', color: 'var(--text-main)' }}
        variants={fadeUp} initial="hidden" animate="show" custom={1}
      >
        Experience <span className="italic-accent">Intelligence</span>
      </motion.h1>

      <motion.p
        style={{ fontSize: '20px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '5rem', fontWeight: 400 }}
        variants={fadeUp} initial="hidden" animate="show" custom={2}
      >
        A smarter way to listen, understand, and improve experiences.
      </motion.p>

      {/* HARMONIC WAVES (THE PERFECT, ELEGANT ANIMATION) */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="show" custom={3}
        style={{ 
          position: 'relative', width: '380px', height: '380px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '1rem', cursor: 'pointer'
        }}
        onClick={scrollToDomains}
      >
        {/* Core Radiating Power Glow */}
        <div style={{
          position: 'absolute', width: '180px', height: '180px',
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(15px)', zIndex: 0
        }} />

        {/* Wave 1 - Outer */}
        <div style={{
          position: 'absolute', inset: -10, border: '1.5px solid rgba(2, 132, 199, 0.3)',
          animation: 'harmonicMorph1 15s linear infinite', transition: 'all 0.4s'
        }} />
        {/* Wave 2 */}
        <div style={{
          position: 'absolute', inset: 10, border: '1.5px solid rgba(5, 150, 105, 0.25)',
          animation: 'harmonicMorph2 20s linear infinite alternate', transition: 'all 0.4s'
        }} />
        {/* Wave 3 */}
        <div style={{
          position: 'absolute', inset: 30, border: '1.5px solid rgba(0, 0, 0, 0.15)',
          animation: 'harmonicMorph3 18s linear infinite reverse', transition: 'all 0.4s'
        }} />
        {/* Wave 4 */}
        <div style={{
          position: 'absolute', inset: 45, border: '1.5px solid rgba(2, 132, 199, 0.2)',
          animation: 'harmonicMorph2 22s linear infinite', transition: 'all 0.4s'
        }} />
        {/* Wave 5 */}
        <div style={{
          position: 'absolute', inset: 60, border: '1.5px solid rgba(5, 150, 105, 0.15)',
          animation: 'harmonicMorph3 14s linear infinite alternate-reverse', transition: 'all 0.4s'
        }} />
        {/* Wave 6 - Inner */}
        <div style={{
          position: 'absolute', inset: 75, border: '1.5px solid rgba(0, 0, 0, 0.1)',
          animation: 'harmonicMorph1 26s linear infinite reverse', transition: 'all 0.4s'
        }} />

        {/* Central Core */}
        <div style={{
          background: '#FFFFFF', padding: '14px 28px', borderRadius: '100px',
          display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Try the analysis demo</span>
          <span style={{ background: 'rgba(8, 145, 178, 0.08)', color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>START</span>
        </div>
        
      </motion.div>
    </div>
  )
}