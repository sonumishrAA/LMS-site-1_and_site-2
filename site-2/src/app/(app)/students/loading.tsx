import { Skeleton } from "@/components/ui/Skeleton"

export default function StudentsLoading() {
  return (
    <div className="pb-24 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-100 px-6 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-11 rounded-2xl" />
            <Skeleton className="h-11 w-11 rounded-2xl" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex gap-2.5 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* List Skeleton */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-[1.25rem]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36 rounded" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-3 w-28 rounded" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-7 w-20 rounded-xl" />
            </div>
            
            <div className="bg-gray-50/50 rounded-2xl p-4 space-y-4 border border-gray-100/50">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-2 w-12" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100/80">
                <div className="flex-1 flex gap-2 items-center">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-10" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-10" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
