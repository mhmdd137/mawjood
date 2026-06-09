'use client'

import { useState, useTransition } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, Building2 } from 'lucide-react'
import {
  approveOrganization,
  revokeOrganization,
} from '@/features/admin/actions/admin.actions'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrgRow {
  id: string
  full_name: string
  bio: string
  is_verified: boolean
  created_at: string
  avatar_url: string | null
  opportunities_count: number
}

interface Props {
  orgs: OrgRow[]
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

// ─── Org Card ─────────────────────────────────────────────────────────────────

function OrgCard({
  org,
  onUpdate,
}: {
  org: OrgRow
  onUpdate: (id: string, is_verified: boolean) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [actionDone, setActionDone] = useState<'approved' | 'revoked' | null>(null)

  function handleApprove() {
    startTransition(async () => {
      await approveOrganization(org.id)
      setActionDone('approved')
      onUpdate(org.id, true)
    })
  }

  function handleRevoke() {
    startTransition(async () => {
      await revokeOrganization(org.id)
      setActionDone('revoked')
      onUpdate(org.id, false)
    })
  }

  return (
    <div
      className="bg-white rounded-xl p-4 flex flex-col gap-3"
      style={{
        border: '0.5px solid #E5E5E5',
        borderRight: `3px solid ${org.is_verified ? '#0F6E56' : '#993C1D'}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[13px] font-medium"
            style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
            aria-hidden="true"
          >
            {org.avatar_url ? (
              <img
                src={org.avatar_url}
                alt={org.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(org.full_name)
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 flex-row-reverse">
              <p className="text-[14px] font-medium" style={{ color: '#1A1A1A' }}>
                {org.full_name}
              </p>
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={
                  org.is_verified
                    ? { backgroundColor: '#EEEDFE', color: '#3C3489' }
                    : { backgroundColor: '#FAECE7', color: '#993C1D' }
                }
              >
                {org.is_verified ? '✓ موثّقة' : 'غير موثّقة'}
              </span>
            </div>
            <p className="text-[12px] mt-0.5" style={{ color: '#787582' }}>
              {org.opportunities_count} فرصة
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      {org.bio && (
        <p
          className="text-[12px] text-right leading-relaxed line-clamp-2"
          style={{ color: '#666666' }}
        >
          {org.bio}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-row-reverse pt-2" style={{ borderTop: '0.5px solid #F0ECF4' }}>
        <p className="text-[11px]" style={{ color: '#9CA3AF' }}>
          انضمت {formatDate(org.created_at)}
        </p>

        {actionDone === 'approved' && (
          <span className="text-[12px]" style={{ color: '#0F6E56' }}>✓ تم التوثيق</span>
        )}
        {actionDone === 'revoked' && (
          <span className="text-[12px]" style={{ color: '#993C1D' }}>تم إلغاء التوثيق</span>
        )}
        {!actionDone && (
          org.is_verified ? (
            <button
              onClick={handleRevoke}
              disabled={isPending}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
              style={{ backgroundColor: '#FAECE7', color: '#993C1D', border: '0.5px solid #F0C4B0' }}
            >
              {isPending ? '...' : 'إلغاء التوثيق'}
            </button>
          ) : (
            <button
              onClick={handleApprove}
              disabled={isPending}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
              style={{ backgroundColor: '#EEEDFE', color: '#3C3489', border: '0.5px solid #AFA9EC' }}
            >
              {isPending ? '...' : 'توثيق'}
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminOrgsPage({ orgs: initialOrgs }: Props) {
  const [orgs, setOrgs] = useState<OrgRow[]>(initialOrgs)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')

  const filtered = orgs.filter((org) => {
    const matchesSearch =
      org.full_name.toLowerCase().includes(search.toLowerCase()) ||
      org.bio.toLowerCase().includes(search.toLowerCase())
      
    const matchesFilter =
      filter === 'all' ||
      (filter === 'verified' && org.is_verified) ||
      (filter === 'pending' && !org.is_verified)
    return matchesSearch && matchesFilter
  })

  function handleUpdate(id: string, is_verified: boolean) {
    setOrgs((prev) =>
      prev.map((o) => (o.id === id ? { ...o, is_verified } : o))
    )
  }

  const verifiedCount = orgs.filter((o) => o.is_verified).length
  const pendingCount = orgs.filter((o) => !o.is_verified).length

  return (
    <DashboardLayout title="المنظمات" role="admin">
      <div dir="rtl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-right">
            <h2 className="text-[20px] font-medium" style={{ color: '#1A1A1A' }}>
              المنظمات
            </h2>
            <p className="text-[13px] mt-0.5" style={{ color: '#666666' }}>
              {verifiedCount} موثّقة · {pendingCount} بانتظار المراجعة
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
              placeholder="بحث باسم المنظمة"
              className="w-full pr-9 pl-4 py-2 rounded-lg text-[13px] text-right outline-none"
              style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
              aria-label="بحث عن منظمة"
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-row-reverse mb-5">
          {([
            { value: 'all',      label: `الكل (${orgs.length})` },
            { value: 'verified', label: `موثّقة (${verifiedCount})` },
            { value: 'pending',  label: `معلّقة (${pendingCount})` },
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
              <Building2 size={20} style={{ color: '#787582' }} aria-hidden="true" />
            </div>
            <p className="text-[14px]" style={{ color: '#666666' }}>
              {search ? 'لا توجد نتائج للبحث' : 'لا توجد منظمات بعد'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((org) => (
              <OrgCard key={org.id} org={org} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}