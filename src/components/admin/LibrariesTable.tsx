'use client'

import React, { useState, useMemo } from 'react'
import { format, differenceInDays, isPast } from 'date-fns'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Library {
  id: string
  name: string
  city: string
  state: string
  email: string
  phone?: string
  subscription_status: string
  subscription_plan: string
  expires_at?: string
  created_at: string
  address?: string
  pincode?: string
  male_seats?: number
  female_seats?: number
  neutral_seats?: number
  has_lockers?: boolean
  staff_count?: number
  delete_date?: string
}

export default function LibrariesTable({ initialData }: { initialData: Library[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const states = useMemo(() => {
    const s = new Set(initialData.map(l => l.state))
    return Array.from(s).sort()
  }, [initialData])

  const filteredData = useMemo(() => {
    return initialData.filter(lib => {
      const matchesSearch = 
        lib.name.toLowerCase().includes(search.toLowerCase()) ||
        lib.city.toLowerCase().includes(search.toLowerCase()) ||
        lib.email.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || lib.subscription_status === statusFilter
      const matchesState = stateFilter === 'all' || lib.state === stateFilter
      const matchesPlan = planFilter === 'all' || lib.subscription_plan === planFilter
      
      return matchesSearch && matchesStatus && matchesState && matchesPlan
    })
  }, [initialData, search, statusFilter, stateFilter, planFilter])

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input 
            type="text" 
            placeholder="Search by name, city, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-sm"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="deleted">Deleted</option>
        </select>

        <select 
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        >
          <option value="all">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10"
        >
          <option value="all">All Plans</option>
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="12m">12 Months</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Library Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">City, State</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Expires</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Owner Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((lib) => {
                  const isExpiring = lib.expires_at && differenceInDays(new Date(lib.expires_at), new Date()) <= 7 && differenceInDays(new Date(lib.expires_at), new Date()) > 0
                  const isPastExpiry = lib.expires_at && isPast(new Date(lib.expires_at))
                  
                  return (
                    <React.Fragment key={lib.id}>
                      <tr 
                        onClick={() => toggleRow(lib.id)}
                        className={`
                          hover:bg-gray-50/80 transition-all cursor-pointer group
                          ${isExpiring ? 'bg-amber-50/30' : ''}
                          ${isPastExpiry && lib.subscription_status === 'expired' ? 'bg-red-50/30' : ''}
                        `}
                      >
                        <td className="px-6 py-5 font-bold text-brand-900 text-sm">
                          <div className="flex items-center gap-2">
                            {lib.name}
                            {expandedRow === lib.id ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600 font-medium">{lib.city}, {lib.state}</td>
                        <td className="px-6 py-5">
                          <span className="px-2 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold">{lib.subscription_plan || '1m'}</span>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={lib.subscription_status} isExpiring={!!isExpiring} />
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-600">
                          {lib.expires_at ? format(new Date(lib.expires_at), 'd MMM yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500 font-medium">{lib.email}</td>
                      </tr>
                      
                      {expandedRow === lib.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 bg-gray-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Address & Contact</h4>
                                  <div className="space-y-3">
                                    <p className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
                                      <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                                      <span>{lib.address || 'No address provided'}<br/>{lib.city}, {lib.state} - {lib.pincode}</span>
                                    </p>
                                    <a href={`mailto:${lib.email}`} className="flex items-center gap-2.5 text-sm text-brand-600 font-bold hover:underline">
                                      <Mail className="w-4 h-4" /> {lib.email}
                                    </a>
                                    {lib.phone && (
                                      <a href={`tel:${lib.phone}`} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium hover:text-brand-500">
                                        <Phone className="w-4 h-4" /> {lib.phone}
                                      </a>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                  <a 
                                    href={`mailto:${lib.email}`}
                                    className="px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-colors shadow-sm"
                                  >
                                    Email Owner
                                  </a>
                                  {lib.phone && (
                                    <a 
                                      href={`https://wa.me/91${lib.phone}`}
                                      target="_blank"
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Subscription Details</h4>
                                  <div className="space-y-3">
                                    <p className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                      <Calendar className="w-4 h-4 text-brand-500" /> 
                                      Registered: {format(new Date(lib.created_at), 'd MMM yyyy')}
                                    </p>
                                    <p className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                      <CreditCard className="w-4 h-4 text-brand-500" />
                                      Current Plan: {lib.subscription_plan || '1m'}
                                    </p>
                                    {lib.delete_date && (
                                      <p className={`flex items-center gap-2.5 text-sm font-bold ${isPast(new Date(lib.delete_date)) ? 'text-red-600' : 'text-amber-600'}`}>
                                        <AlertCircle className="w-4 h-4" />
                                        Data Delete Date: {format(new Date(lib.delete_date), 'd MMM yyyy')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Capacity & Staff</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                      <Users className="w-4 h-4 text-brand-500" />
                                      Seats: {lib.male_seats || 0}M | {lib.female_seats || 0}F | {lib.neutral_seats || 0}N
                                    </div>
                                    <p className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                      <CheckCircle2 className="w-4 h-4 text-brand-500" />
                                      Staff Count: {lib.staff_count || 0}
                                    </p>
                                    <p className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                                      {lib.has_lockers ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                                      Has Lockers: {lib.has_lockers ? 'Yes' : 'No'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-medium italic">
                    No libraries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status, isExpiring }: { status: string, isExpiring: boolean }) {
  if (isExpiring && status === 'active') {
    return (
      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
        ⚠ Expiring Soon
      </span>
    )
  }

  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-700',
    deleted: 'bg-gray-100 text-gray-500',
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.deleted}`}>
      ● {status}
    </span>
  )
}
