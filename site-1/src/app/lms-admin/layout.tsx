import AdminGuard from '@/components/AdminGuard'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  )
}
