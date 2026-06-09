import Link from "next/link"
import { Building2, MapPin, Calendar, Clock } from "lucide-react"

export interface OpportunityCardProps {
  id: string
  title: string
  organization: string
  location: string
  matchPercentage?: number
  status: 'open' | 'completed' | 'closed'
  skills?: string[]
  timeSlot?: string
  startDate?: string
}

export function OpportunityCard({ 
  id, title, organization, location, 
  matchPercentage = 0, status, skills = [], timeSlot, startDate
}: OpportunityCardProps) {
  
  let borderColor = "#E5E5E5"
  if (matchPercentage >= 80) borderColor = "#534AB7"
  else if (matchPercentage >= 40) borderColor = "#AFA9EC"

  const statusLabel = { open: 'مفتوحة', completed: 'مكتملة', closed: 'مغلقة' }
  const statusStyle = {
    open: { background: '#E1F5EE', color: '#0F6E56' },
    completed: { background: '#FAEEDA', color: '#854F0B' },
    closed: { background: '#FCEBEB', color: '#A32D2D' },
  }

  return (
    <Link href={`/opportunities/${id}`} className="block h-full">
      <div
        className="h-full bg-white rounded-xl flex flex-col transition-all duration-150 hover:opacity-90"
        style={{
          border: '0.5px solid #E5E5E5',
          borderRight: `3px solid ${borderColor}`,
        }}
      >
        <div className="p-5 flex flex-col h-full">
          
          {/* ROW 1: status RIGHT + score LEFT */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-medium rounded-full px-2 py-1"
            style={statusStyle[status]}
          >
            {statusLabel[status]}
          </span>
          <span
            className="text-xs font-medium rounded-full px-2 py-1"
            style={{ background: '#EEEDFE', color: '#3C3489' }}
          >
            {matchPercentage}% تطابق
          </span>
        </div>

          {/* ROW 2: title */}
          <h3 className="text-base font-medium text-right mb-2" style={{ color: '#1A1A1A' }}>
            {title}
          </h3>

          {/* ROW 3: org */}
          <div className="flex items-center gap-1 justify-end mb-1">
            <span className="text-xs" style={{ color: '#666666' }}>{organization}</span>
            <Building2 className="h-3.5 w-3.5" style={{ color: '#666666' }} />
          </div>

          {/* ROW 4: location */}
          <div className="flex items-center gap-1 justify-end mb-3">
            <span className="text-xs" style={{ color: '#666666' }}>{location}</span>
            <MapPin className="h-3.5 w-3.5" style={{ color: '#666666' }} />
          </div>

          {/* ROW 5: skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end mb-3">
              {skills.slice(0, 3).map(skill => (
                <span
                  key={skill}
                  className="text-xs rounded-full px-2 py-0.5"
                  style={{ background: '#F0ECF4', color: '#534AB7' }}
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs rounded-full px-2 py-0.5" style={{ background: '#F0ECF4', color: '#534AB7' }}>
                  +{skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* ROW 6: time + date */}
          <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '0.5px solid #E5E5E5' }}>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" style={{ color: '#666666' }} />
              <span className="text-xs" style={{ color: '#666666' }}>{startDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color: '#666666' }}>{timeSlot}</span>
              <Clock className="h-3.5 w-3.5" style={{ color: '#666666' }} />
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}