const VARIANTS = {
  card: { wrap: 'card', label: 'text-muted', value: 'text-bark', sub: 'text-muted' },
  sandstone: { wrap: 'bg-sandstone rounded-card', label: 'text-bark/60', value: 'text-bark', sub: 'text-bark/60' },
  hero: { wrap: 'bg-white/10 rounded-card', label: 'text-cream/70', value: 'text-cream', sub: 'text-cream/70' },
}

export default function StatCard({ label, value, sub, variant = 'card' }) {
  const v = VARIANTS[variant] || VARIANTS.card
  return (
    <div className={`px-3 py-2.5 ${v.wrap}`}>
      <p className={`text-[11px] font-body uppercase tracking-widest ${v.label}`}>{label}</p>
      <p className={`text-xl font-display font-bold mt-0.5 ${v.value}`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${v.sub}`}>{sub}</p>}
    </div>
  )
}
