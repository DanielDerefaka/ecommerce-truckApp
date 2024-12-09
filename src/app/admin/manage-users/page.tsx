// page.tsx
import { Suspense } from 'react'


import { Loader2 } from 'lucide-react'
import ManageUsersClient from '@/components/admin/Users'
import { getUsers } from '@/lib/UserQueries'

interface PageProps {
  searchParams: { search?: string }
}

export default async function Page({ searchParams }: PageProps) {
  const users = await getUsers(searchParams.search)
  
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
      <ManageUsersClient users={users} searchParams={searchParams} />
    </Suspense>
  )
}