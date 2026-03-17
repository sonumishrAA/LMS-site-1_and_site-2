'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const isLoginPage = pathname === '/lms-admin/login'

      if (!token) {
        if (!isLoginPage) {
          router.push('/lms-admin/login')
        }
        setLoading(false)
        return
      }

      // If token exists and is loging page, go to dashboard
      if (isLoginPage) {
        router.push('/lms-admin')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
