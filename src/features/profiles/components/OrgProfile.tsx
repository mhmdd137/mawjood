import { MapPin, Calendar, ShieldCheck } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrgProfileData {
  id: string
  full_name: string
  bio: string | null
  location: string
  is_verified: boolean
  avatar_url: string | null
  created_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

export default function OrgProfile({ profile }: { profile: OrgProfileData }) {
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
            aria-label={`شعار ${profile.full_name}`}
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
            <div className="flex items-center gap-2 justify-end mb-1 flex-wrap">
              <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>
                {profile.full_name}
              </h1>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}
              >
                منظمة
              </span>
              {profile.is_verified && (
                <span
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  موثّقة
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 justify-end flex-wrap mt-2">
              {profile.location && (
                <div className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                  <span>{profile.location}</span>
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              )}
              <div className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                <span>عضو منذ {formatJoinDate(profile.created_at)}</span>
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

      {/* Verified note */}
      {profile.is_verified ? (
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-end gap-2"
          style={{ backgroundColor: '#EEEDFE', border: '0.5px solid #AFA9EC' }}
        >
          <p className="text-sm text-right" style={{ color: '#3C3489' }}>
            هذه المنظمة موثّقة من قِبَل فريق موجود وتعمل في بيئة موثوقة
          </p>
          <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: '#3C3489' }} aria-hidden="true" />
        </div>
      ) : (
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-end gap-2"
          style={{ backgroundColor: '#F9F9F9', border: '0.5px solid #E5E5E5' }}
        >
          <p className="text-sm text-right" style={{ color: '#666666' }}>
            هذه المنظمة قيد المراجعة من فريق موجود
          </p>
        </div>
      )}

      {/* Empty bio fallback */}
      {!profile.bio && (
        <div
          className="bg-white rounded-xl p-6 text-center"
          style={{ border: '0.5px solid #E5E5E5' }}
        >
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            لم تُضف هذه المنظمة نبذة تعريفية بعد
          </p>
        </div>
      )}
    </div>
  )
}