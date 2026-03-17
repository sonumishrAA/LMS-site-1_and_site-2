import { Skeleton } from "@/components/ui/Skeleton"
import { ChevronLeft } from "lucide-react"

export default function FinancialCalendarLoading() {
  return (
    <div className="pb-24 max-w-7xl mx-auto w-full space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-14 z-20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-gray-200" />
          </div>
          <Skeleton className="h-7 w-32 rounded-lg" />
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-200 h-12">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>

      <div className="px-4 pt-[70px] space-y-6">
        {/* Summary Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>

        {/* Transactions Table Skeleton */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-20 ml-auto" />
                  <Skeleton className="h-2 w-12 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
