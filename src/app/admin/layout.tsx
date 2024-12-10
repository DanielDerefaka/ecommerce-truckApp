import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@/app/globals.css'
import { Sidebar } from '@/components/admin/Sidebar'
import { redirect } from 'next/navigation'
import { AdminLoginUser } from '@/lib/queries'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Cage Truckings',
  description: 'Manage Admin Panel easier',
  icons: {
    icon: "/truckLogo.ico",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const authenticated = await AdminLoginUser();


  if (authenticated?.status === 400) redirect("/");

  
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}