import React from 'react'
import Link from 'next/link'
import { supabaseService } from '@/lib/supabase/service'
import { format, startOfMonth, subMonths } from 'date-fns'
import { 
  Users, 
  Library as LibraryIcon, 
  AlertTriangle, 
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react'
import ChartsWrapper from '@/components/admin/ChartsWrapper'

export default async function AdminOverview() {
  const today = new Date().toISOString()
  const firstOfThisMonth = startOfMonth(new Date()).toISOString()

  // 1. Total Libraries
  const { count: totalCount } = await supabaseService
    .from('libraries')
    .select('*', { count: 'exact', head: true })

  // 2. Active Libraries
  const { count: activeCount } = await supabaseService
    .from('libraries')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  // 3. Grace Period
  const { count: graceCount } = await supabaseService
    .from('libraries')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'expired')
    .gt('delete_date', today)

  // 4. Monthly Revenue
  const { data: revenueData } = await supabaseService
    .from('subscription_payments')
    .select('amount')
    .eq('status', 'success')
    .gte('created_at', firstOfThisMonth)

  const monthlyRevenue = revenueData?.reduce((sum, p) => sum + p.amount, 0) || 0

  // 5. Real Data Grouping for Charts (Last 6 Months)
  const last6Months = [...Array(6)].map((_, i) => subMonths(new Date(), 5 - i))
  
  const { data: regData } = await supabaseService
    .from('libraries')
    .select('created_at')
    .gte('created_at', last6Months[0].toISOString())

  const { data: revData } = await supabaseService
    .from('subscription_payments')
    .select('amount, created_at')
    .eq('status', 'success')
    .gte('created_at', last6Months[0].toISOString())

  const chartData = last6Months.map(month => {
    const monthStr = format(month, 'MMM')
    const monthYear = format(month, 'yyyy-MM')
    
    const registrations = regData?.filter(lib => 
      format(new Date(lib.created_at), 'yyyy-MM') === monthYear
    ).length || 0

    const revenue = revData?.filter(pay => 
      format(new Date(pay.created_at), 'yyyy-MM') === monthYear
    ).reduce((sum, p) => sum + p.amount, 0) || 0

    return { name: monthStr, registrations, revenue }
  })

  // 6. Recent Registrations
  const { data: recentLibraries } = await supabaseService
    .from('libraries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  // 7. Upcoming Expirations
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  
  const { data: expiringSoon } = await supabaseService
    .from('libraries')
    .select('name, expires_at, email')
    .eq('subscription_status', 'active')
    .lte('expires_at', sevenDaysFromNow.toISOString())
    .gt('expires_at', today)

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-brand-900 mb-1">Overview</h1>
        <p className="text-gray-500 font-medium">
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Libraries" 
          value={totalCount || 0} 
          icon={<LibraryIcon className="w-5 h-5 text-brand-500" />} 
          color="bg-white" 
        />
        <StatCard 
          title="Active Now" 
          value={activeCount || 0} 
          icon={<Users className="w-5 h-5 text-green-500" />} 
          color="bg-white" 
        />
        <StatCard 
          title="In Grace Period" 
          value={graceCount || 0} 
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
          color="bg-white" 
        />
        <StatCard 
          title="Revenue (Month)" 
          value={`₹${monthlyRevenue.toLocaleString()}`} 
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />} 
          color="bg-white" 
        />
      </section>

      {/* Charts Row */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <ChartsWrapper data={chartData} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Registrations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-brand-900">Latest Registrations</h3>
            <Link href="/lms-admin/libraries" className="text-xs font-bold text-brand-500 uppercase tracking-widest hover:underline">View All</Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Library</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentLibraries?.length ? recentLibraries.map((lib) => (
                    <tr key={lib.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <p className="font-bold text-brand-900 text-sm">{lib.name}</p>
                        <p className="text-[10px] text-gray-600 font-medium truncate w-32">{lib.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-600" />
                          {lib.city}, {lib.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-brand-500">
                        {lib.subscription_plan || '1m'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(lib.created_at), 'd MMM')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lib.subscription_status} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-600 text-sm italic">No registrations yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel: Expirations */}
        <div className="lg:col-span-4 space-y-6">
          {expiringSoon && expiringSoon.length > 0 && (
            <div className="bg-amber-50 border-l-[3px] border-amber-500 p-6 rounded-r-2xl space-y-4">
              <h3 className="text-amber-800 font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {expiringSoon.length} libraries expiring soon
              </h3>
              <div className="space-y-4">
                {expiringSoon.map((lib, i) => (
                  <div key={i} className="bg-white/50 p-3 rounded-lg border border-amber-200/50">
                    <p className="text-sm font-bold text-brand-900">{lib.name}</p>
                    <p className="text-xs text-amber-700 font-medium mt-0.5">Expires {format(new Date(lib.expires_at!), 'd MMM')}</p>
                    <a href={`mailto:${lib.email}`} className="text-[10px] text-brand-500 font-bold hover:underline mt-2 block uppercase tracking-wider">Email Owner</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-brand-900 font-bold">Quick Actions</h3>
            <div className="space-y-2">
              <QuickActionLink href="/lms-admin/libraries" label="Manage Libraries" />
              <QuickActionLink href="/lms-admin/pricing" label="Update Pricing" />
              <QuickActionLink href="/lms-admin/messages" label="Check Messages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4`}>
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-brand-900 font-mono tracking-tight">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-red-100 text-red-700',
    grace: 'bg-amber-100 text-amber-700',
    deleted: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.deleted}`}>
      ● {status}
    </span>
  )
}

function QuickActionLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-brand-50 group transition-all">
      <span className="text-sm font-bold text-gray-600 group-hover:text-brand-900 transition-colors">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-500 transition-all group-hover:translate-x-0.5" />
    </Link>
  )
}
