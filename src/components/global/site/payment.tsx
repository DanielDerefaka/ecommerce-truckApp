// app/orders/page.tsx
import { client,  } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { OrderStatus } from '@prisma/client'
import OrderProgress from './OrderProgress'
import { getUserOrderbyId, getUserOrders } from '@/lib/queries'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

function getOrderStep(status: OrderStatus): 'confirmed' | 'shipped' | 'delivered' {
  switch (status) {
    case 'PENDING':
    case 'PROCESSING':
      return 'confirmed'
    case 'SHIPPED':
      return 'shipped'
    case 'DELIVERED':
      return 'delivered'
    case 'CANCELLED':
      return 'confirmed'
    default:
      return 'confirmed'
  }
}



export default async function OrdersPage(id:any) {



 


  

  const orders = await getUserOrderbyId(id)

  if (!orders) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Order Not Found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex gap-2 text-green-600">Payment Sucessful <CheckCircle className='text-green-600'/> </h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  Order #{orders.paymentIntentId}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Placed on {new Date().toLocaleDateString()}
                </p>
              </div>
              <p className="text-lg font-semibold">
                ${(orders.amount / 100).toFixed(2)}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <OrderProgress currentStep={getOrderStep(orders.status)} />
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-4">
                  {orders.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      {item.product.images[0] && (
                        <div className="h-16 w-16 flex-shrink-0">
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name || 'Product'}
                            className="h-full w-full object-cover rounded"
                            width={500}
                            height={500}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${(item.price / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Status Updates</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Order Status</span>
                    <span className="font-medium">{orders.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Expected Delivery</span>
                    <span className="font-medium">
                      {orders.status === 'DELIVERED' 
                        ? 'Delivered'
                        : orders.status === 'CANCELLED'
                        ? 'Cancelled'
                        : 'Within 3-5 business days'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}