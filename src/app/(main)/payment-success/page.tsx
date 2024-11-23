import OrdersPage from '@/components/global/site/payment'
import React from 'react'

const page = ({  searchParams: { orderId }, }:  {
    searchParams: { orderId: string };
  }) => {


      console.log(orderId);
    

      const id  = orderId;
    
     
  return (
    <div>
      <OrdersPage id={id}/>
    </div>
  )
}

export default page
