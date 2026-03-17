import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-4 space-y-5 pb-24 max-w-7xl mx-auto w-full">
      {/* Revenue Header Skeleton */}
      <div className="bg-gray-200 rounded-2xl p-5 relative overflow-hidden h-40">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-white/20" />
          <Skeleton className="h-10 w-48 bg-white/30" />
          <Skeleton className="h-3 w-32 bg-white/20" />
        </div>
        <div className="absolute top-5 right-5 text-right space-y-2">
          <Skeleton className="h-4 w-20 bg-white/20 ml-auto" />
          <Skeleton className="h-5 w-24 bg-white/30 ml-auto" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 pt-3 border-t border-white/10 flex justify-between">
          <Skeleton className="h-3 w-24 bg-white/20" />
          <Skeleton className="h-4 w-32 bg-white/20" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Shift Occupancy Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <Skeleton className="h-3 w-32 rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>

      {/* Alerts Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
        <div className="px-4 py-3 border-b border-gray-100">
          <Skeleton className="h-4 w-32" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 flex gap-3">
            <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-2 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
