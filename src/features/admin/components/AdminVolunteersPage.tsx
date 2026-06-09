'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, Users } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VolunteerRow {
  id: string
  full_name: string
  location: string
  skills: string[]
  created_at: string
  applications_count: number
  avatar_url: string | null
}

interface Props {
  volunteers: VolunteerRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
}

// ─── Volunteer Card ───────────────────────────────────────────────────────────

function VolunteerCard({ volunteer }: { volunteer: VolunteerRow }) {
  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col gap-3"
      style={{ border: '0.5px solid #E5E5E5', borderRight: '3px solid #3C3489' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[13px] font-medium"
            style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
            aria-hidden="true"
          >
            {volunteer.avatar_url ? (
              <img
                src={volunteer.avatar_url}
                alt={volunteer.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(volunteer.full_name)
            )}
          </div>
          <div className="text-right">
            <p className="text-[14px] font-medium" style={{ color: '#1A1A1A' }}>
              {volunteer.full_name}
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: '#787582' }}>
              {volunteer.location}
            </p>
          </div>
        </div>

        {/* Applications count */}
        <div className="text-right flex-shrink-0">
          <p className="text-[22px] font-medium" style={{ color: '#3C3489' }}>
            {volunteer.applications_count}
          </p>
          <p className="text-[11px]" style={{ color: '#787582' }}>تقديم</p>
        </div>
      </div>

      {/* Skills */}
      {volunteer.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-end">
          {volunteer.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: '#E5E1E9', color: '#474551' }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-[11px] text-right" style={{ color: '#9CA3AF' }}>
        انضم {formatDate(volunteer.created_at)}
      </p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminVolunteersPage({ volunteers }: Props) {
  const [search, setSearch] = useState('')

  const filtered = volunteers.filter((v) =>
  v.full_name.toLowerCase().includes(search.toLowerCase()) ||
  v.location.toLowerCase().includes(search.toLowerCase()) ||
  v.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
)

  return (
    <DashboardLayout title="المتطوعون" role="admin">
      <div dir="rtl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-right">
            <h2 className="text-[20px] font-medium" style={{ color: '#1A1A1A' }}>
              المتطوعون
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#666666' }}>
              {volunteers.length} متطوع مسجل
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute top-1/2 -translate-y-1/2 right-3"
              style={{ color: '#787582' }}
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم أو مهارة أو موقع"
              className="w-full pr-9 pl-4 py-2 rounded-lg text-[13px] text-right outline-none"
              style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
              aria-label="بحث عن متطوع"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: '#E5E1E9' }}
            >
              <Users size={20} style={{ color: '#787582' }} aria-hidden="true" />
            </div>
            <p className="text-[14px]" style={{ color: '#666666' }}>
              {search ? 'لا توجد نتائج للبحث' : 'لا يوجد متطوعون بعد'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <VolunteerCard key={v.id} volunteer={v} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}