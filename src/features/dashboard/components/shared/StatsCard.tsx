interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div
      className="rounded-xl px-5 py-4 text-right"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: '#EEEDFE' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-[22px] font-medium" style={{ color: '#3C3489' }}>
        {value.toLocaleString('ar-EG')}
      </p>
      <p className="text-xs mt-0.5" style={{ color: '#666666' }}>
        {label}
      </p>
    </div>
  )
}