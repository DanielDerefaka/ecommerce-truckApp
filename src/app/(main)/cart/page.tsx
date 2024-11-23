import CartPage from '@/components/global/cartpage'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async  () => {
  const user = await currentUser()

  if(!user) redirect('/sign-in')
    
  return (
    <div>
        <CartPage/>
    </div>
  )
}

export default page