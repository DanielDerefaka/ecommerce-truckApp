import DashboardPage from '@/components/admin/Dashboard'
import { getUserDetails } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const page = async () => {
  const user = await currentUser();

  if(!user) {
    return null
  }


  const response = await getUserDetails(user.id);



  return (
    <div>
       <DashboardPage user={response.data}/>
    </div>
  )
}

export default page