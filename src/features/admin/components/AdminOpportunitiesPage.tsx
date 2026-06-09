'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, Briefcase } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityRow {
  id: string
  title: string
  category: string
  location: string
  status: 'draft' | 'open' | 'closed' | 'completed'
  created_at: string
  org_name: string
  applications_count: number
}

interface Props {
  opportunities: OpportunityRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const STATUS_MAP = {
  open:      { label: 'مفتوحة',  bg: '#E1F5EE', color: '#0F6E56' },
  closed:    { label: 'مغلقة',   bg: '#FCEBEB', color: '#A32D2D' },
  completed: { label: 'مكتملة',  bg: '#FAEEDA', color: '#854F0B' },
  draft:     { label: 'مسودة',   bg: '#F0ECF4', color: '#666666' },
} as const

const BORDER_MAP = {
  open:      '#0F6E56',
  closed:    '#A32D2D',
  completed: '#854F0B',
  draft:     '#C8C4D3',
} as const

// ─── Opportunity Card ─────────────────────────────────────────────────────────

function OpportunityCard({ opportunity }: { opportunity: OpportunityRow }) {
  const { label, bg, color } = STATUS_MAP[opportunity.status]

  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col gap-3"
      style={{
        border: '0.5px solid #E5E5E5',
        borderRight: `3px solid ${BORDER_MAP[opportunity.status]}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-row-reverse">
        <div className="text-right flex-1 min-w-0">
          <p className="text-[14px] font-medium truncate" style={{ color: '#1A1A1A' }}>
            {opportunity.title}
          </p>
          <p className="text-[12px] mt-0.5 truncate" style={{ color: '#787582' }}>
            {opportunity.org_name}
          </p>
        </div>
        <span
          className="text-[11px] font-medium px-2.5 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: bg, color }}
        >
          {label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-1.5 justify-end">
        <span
          className="text-[11px] px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
        >
          {opportunity.category}
        </span>
        <span
          className="text-[11px] px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#F0ECF4', color: '#474551' }}
        >
          {opportunity.location}
        </span>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between flex-row-reverse pt-2"
        style={{ borderTop: '0.5px solid #F0ECF4' }}
      >
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
          {formatDate(opportunity.created_at)}
        </p>
        <div className="flex items-center gap-1 flex-row-reverse">
          <p className="text-[13px] font-medium" style={{ color: '#3C3489' }}>
            {opportunity.applications_count}
          </p>
          <p className="text-[11px]" style={{ color: '#787582' }}>متقدم</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminOpportunitiesPage({ opportunities }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'completed' | 'draft'>('all')

  const filtered = opportunities.filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.org_name.toLowerCase().includes(search.toLowerCase()) ||
        opp.category.toLowerCase().includes(search.toLowerCase()) ||
        opp.location.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || opp.status === filter
    return matchesSearch && matchesFilter
  })

  const counts = {
    all: opportunities.length,
    open: opportunities.filter((o) => o.status === 'open').length,
    closed: opportunities.filter((o) => o.status === 'closed').length,
    completed: opportunities.filter((o) => o.status === 'completed').length,
    draft: opportunities.filter((o) => o.status === 'draft').length,
  }

  return (
    <DashboardLayout title="الفرص" role="admin">
      <div dir="rtl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-right">
            <h2 className="text-[20px] font-medium" style={{ color: '#1A1A1A' }}>
              الفرص التطوعية
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#666666' }}>
              {counts.all} فرصة مسجلة · {counts.open} مفتوحة
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
              placeholder="بحث بالعنوان أو المنظمة"
              className="w-full pr-9 pl-4 py-2 rounded-lg text-[13px] text-right outline-none"
              style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
              aria-label="بحث عن فرصة"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-row-reverse flex-wrap mb-5">
          {([
            { value: 'all',       label: `الكل (${counts.all})` },
            { value: 'open',      label: `مفتوحة (${counts.open})` },
            { value: 'closed',    label: `مغلقة (${counts.closed})` },
            { value: 'completed', label: `مكتملة (${counts.completed})` },
            { value: 'draft',     label: `مسودة (${counts.draft})` },
          ] as { value: typeof filter; label: string }[]).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
              style={
                filter === f.value
                  ? { backgroundColor: '#3C3489', color: 'white' }
                  : { backgroundColor: 'white', color: '#474551', border: '0.5px solid #E5E5E5' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: '#E5E1E9' }}
            >
              <Briefcase size={20} style={{ color: '#787582' }} aria-hidden="true" />
            </div>
            <p className="text-[14px]" style={{ color: '#666666' }}>
              {search ? 'لا توجد نتائج للبحث' : 'لا توجد فرص بعد'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}