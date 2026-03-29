import { motion } from 'framer-motion'

const steps = [
  { n: '1', title: 'Pick your domain', desc: 'Choose from restaurant, hotel, hospital, mess and more — feedback is tailored to your context.' },
  { n: '2', title: 'Submit feedback', desc: 'Type your honest experience. Our AI reads it instantly — no forms, no grids, just words.' },
  { n: '3', title: 'See your analysis', desc: 'Sentiment, detected issues, and a deep breakdown appear immediately after you submit.' },
]

export default function HowItWorks() {
  return (
    <div style={{ padding: '8rem 2rem', maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
        style={{ marginBottom: '4rem', textAlign: 'center' }}
      >
        <div style={label}>How it works</div>
        <div className="heading" style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-1px', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Three Steps to <em className="italic-accent">Clarity</em>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            className="glass-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(2, 132, 199, 0.08)', color: 'var(--accent-blue)', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
              {s.n}
            </div>
            <div className="heading" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-main)' }}>{s.title}</div>
            <div style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const label = { fontSize: '12px', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }