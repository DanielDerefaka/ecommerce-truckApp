import { Check, Truck, Package } from 'lucide-react'
import { OrderStatus } from '@/lib/types'

interface OrderProgressProps {
  currentStep: 'confirmed' | 'shipped' | 'delivered'
}

export function getOrderStep(status: OrderStatus): 'confirmed' | 'shipped' | 'delivered' {
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

export function OrderProgress({ currentStep }: OrderProgressProps) {
  const steps = [
    { icon: Check, label: 'Confirmed', status: 'confirmed' },
    { icon: Package, label: 'Shipped', status: 'shipped' },
    { icon: Truck, label: 'Delivered', status: 'delivered' },
  ] as const

  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto mb-8">
      {steps.map((step, index) => {
        const isActive = steps.findIndex(s => s.status === currentStep) >= index
        return (
          <div key={step.status} className="flex flex-col items-center">
            <div 
              className={`rounded-full p-2 ${
                isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <step.icon className="h-6 w-6" />
            </div>
            <span 
              className={`mt-2 text-sm ${
                isActive ? 'text-green-500 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default OrderProgress