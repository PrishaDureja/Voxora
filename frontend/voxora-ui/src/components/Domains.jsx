import { motion } from 'framer-motion'

const domains = [
  { icon: '🍽️', title: 'Restaurant', desc: 'Food quality, service speed, ambiance, staff behaviour.', tag: 'Food & dining' },
  { icon: '🏨', title: 'Hotel', desc: 'Room experience, check-in, cleanliness, amenities.', tag: 'Hospitality' },
  { icon: '🏥', title: 'Hospital', desc: 'Patient care, wait times, staff conduct, hygiene.', tag: 'Healthcare' },
  { icon: '🏢', title: 'Hostel', desc: 'Dorms, facilities, safety, social atmosphere.', tag: 'Accommodation' },
  { icon: '🍛', title: 'Mess', desc: 'Daily meals, hygiene, portion size, variety.', tag: 'Institutional food' },
  { icon: '🌐', title: 'Other', desc: 'Any service or product not listed above.', tag: 'General' },
]

export default function Domains() {
  return (
    <div style={{ padding: '8rem 3rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ marginBottom: '3rem' }}
      >
        <div style={sectionLabel}>Domains</div>
        <div style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '0.75rem', color: '#1C1917' }}>Choose your industry</div>
        <div style={{ fontSize: '16px', color: '#78716C' }}>Select a domain to start analysing feedback tailored to your context.</div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {domains.map((d, i) => (
          <motion.div
            key={d.title} style={card}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -4, borderColor: '#FCD34D' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '1rem' }}>{d.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: '#1C1917' }}>{d.title}</div>
            <div style={{ fontSize: '13px', color: '#78716C', lineHeight: 1.6 }}>{d.desc}</div>
            <div style={tagStyle}>{d.tag}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const sectionLabel = { fontSize: '12px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }
const card = {
  background: 'rgba(255,253,245,0.85)', backdropFilter: 'blur(12px)',
  border: '0.5px solid #FDE68A', borderRadius: '16px',
  padding: '1.75rem', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s'
}
const tagStyle = { display: 'inline-block', marginTop: '14px', fontSize: '11px', color: '#92400E', background: '#FEF3C7', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }