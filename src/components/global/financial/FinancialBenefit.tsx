interface Benefit {
    title: string
    description: string
    icon: React.ComponentType
  }
  
  import { Truck, Clock, Calculator, Shield } from 'lucide-react'
  
  export default function FinancingBenefits() {
    const benefits: Benefit[] = [
      {
        title: 'Extensive Inventory',
        description: 'Access North America\'s largest selection of quality used trucks',
        icon: Truck
      },
      {
        title: 'Quick Approval',
        description: 'Get approved within 24 hours with our streamlined process',
        icon: Clock
      },
      {
        title: 'Flexible Terms',
        description: 'Customized payment plans that match your business needs',
        icon: Calculator
      },
      {
        title: 'Complete Protection',
        description: 'Comprehensive warranty options for peace of mind',
        icon: Shield
      }
    ]
  
    return (
      <section className=" bg-gray-50 rounded-2xl my-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Arrow Advantage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  