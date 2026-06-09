import { MapPin, Clock, Calendar } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VolunteerProfileData {
  id: string
  full_name: string
  bio: string | null
  location: string
  skills: string[]
  time_slot: 'morning' | 'afternoon' | 'flexible' | null
  avatar_url: string | null
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIME_SLOT_LABELS: Record<string, string> = {
  morning:   'صباحي',
  afternoon: 'مسائي',
  flexible:  'مرن',
}

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    month: 'long',
    year:  'numeric',
  })
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VolunteerProfile({ profile }: { profile: VolunteerProfileData }) {
  return (
    <div dir="rtl" className="flex flex-col gap-5">

      {/* Header card */}
      <div
        className="bg-white rounded-xl p-6"
        style={{ border: '0.5px solid #E5E5E5' }}
      >
        <div className="flex items-start gap-5 flex-row-reverse">

          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-medium text-white flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: '#3C3489' }}
            aria-label={`صورة ${profile.full_name}`}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(profile.full_name)
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>
                {profile.full_name}
              </h1>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
              >
                متطوع
              </span>
            </div>

            <div className="flex items-center gap-4 justify-end flex-wrap mt-2">
              {profile.location && (
                <div className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                  <span>{profile.location}</span>
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              )}
              {profile.time_slot && (
                <div className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                  <span>{TIME_SLOT_LABELS[profile.time_slot]}</span>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              )}
              <div className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                <span>انضم {formatJoinDate(profile.created_at)}</span>
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p
            className="mt-4 text-right leading-relaxed pt-4"
            style={{
              fontSize:   '15px',
              color:      '#474551',
              lineHeight: '1.7',
              borderTop:  '0.5px solid #E5E5E5',
            }}
          >
            {profile.bio}
          </p>
        )}
      </div>

      {/* Skills card */}
      {profile.skills && profile.skills.length > 0 && (
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '0.5px solid #E5E5E5' }}
        >
          <h2
            className="text-base font-medium text-right mb-4"
            style={{ color: '#1A1A1A' }}
          >
            المهارات
          </h2>
          <div className="flex flex-wrap gap-2 justify-end">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#F0ECF4', color: '#534AB7' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty bio fallback */}
      {!profile.bio && (
        <div
          className="bg-white rounded-xl p-6 text-center"
          style={{ border: '0.5px solid #E5E5E5' }}
        >
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            لم يُضف هذا المتطوع نبذة شخصية بعد
          </p>
        </div>
      )}
    </div>
  )
}