import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import CTABand from '../components/CTABand'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Utensils, Building2, Activity, Map, Soup, Globe } from 'lucide-react'

const domains = [
  { icon: <Utensils strokeWidth={1.5} size={24} />, title: 'Restaurant', tag: 'Food & dining', desc: 'Food quality, service speed, ambiance, staff behaviour.' },
  { icon: <Building2 strokeWidth={1.5} size={24} />, title: 'Hotel', tag: 'Hospitality', desc: 'Room experience, check-in, cleanliness, amenities.' },
  { icon: <Activity strokeWidth={1.5} size={24} />, title: 'Hospital', tag: 'Healthcare', desc: 'Patient care, wait times, staff conduct, hygiene.' },
  { icon: <Map strokeWidth={1.5} size={24} />, title: 'Hostel', tag: 'Accommodation', desc: 'Dorms, facilities, safety, social atmosphere.' },
  { icon: <Soup strokeWidth={1.5} size={24} />, title: 'Mess', tag: 'Institutional food', desc: 'Daily meals, hygiene, portion size, variety.' },
  { icon: <Globe strokeWidth={1.5} size={24} />, title: 'Other', tag: 'General', desc: 'Any service or product not listed above.' },
]

export default function Home() {
  const navigate = useNavigate()
  const { selectDomain } = useAuth()

  const handleDomainClick = (domain) => {
    selectDomain(domain.title)
    navigate('/role')
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="elegant-bg" />
      <div className="noise-overlay" />
      <div className="aurora-sweep-1" /><div className="aurora-sweep-2" />
      
      <Navbar />
      <Hero />

      <div id="domains" style={{ padding: '8rem 2rem', maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
          style={{ marginBottom: '5rem', textAlign: 'center' }}
        >
          <div style={sectionLabel}>Domains</div>
          <h2 className="heading" style={{ fontSize: '42px', fontWeight: 600, letterSpacing: '-1px', marginBottom: '1.25rem' }}>
            Choose Your <span className="italic-accent" style={{ color: 'var(--accent-cyan)' }}>Industry</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontWeight: 400 }}>
            Click a domain below to get started — we dynamically tailor our deep learning engines to your specific context.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {domains.map((d, i) => (
            <motion.div
              key={d.title}
              className="glass-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => handleDomainClick(d)}
              style={{ cursor: 'pointer', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.08)', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>
                {d.icon}
              </div>
              <div className="heading" style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>{d.title}</div>
              <div style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, minHeight: '44px', flex: 1 }}>{d.desc}</div>
              <div><span style={tagStyle}>{d.tag}</span></div>
            </motion.div>
          ))}
        </div>
      </div>

      <div id="how-it-works" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.01))', pointerEvents: 'none' }} />
        <HowItWorks />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}><CTABand /></div>
      <div style={{ position: 'relative', zIndex: 1 }}><Footer /></div>
    </div>
  )
}

const sectionLabel = { fontSize: '12px', fontWeight: 600, color: 'var(--accent-peach)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }
const tagStyle = { display: 'inline-block', marginTop: '1.5rem', fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.03)', padding: '4px 12px', borderRadius: '100px', fontWeight: 500, border: '1px solid rgba(0,0,0,0.05)' }