'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Search, ShoppingCart, Heart, ChevronDown, Plus, Minus, X, Info } from 'lucide-react'

export default function CartPage() {
  const [quantities, setQuantities] = useState({
    item1: 2,
    item2: 2,
    item3: 2,
    item4: 2
  })

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, prev[itemId] + delta)
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">


   

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Address Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h2 className="font-semibold">No address saved</h2>
                    <p className="text-sm text-muted-foreground">Add an address so we can get tracking on the delivery!</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Add new locations</Button>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Choose how to pay</h2>
                <Button variant="link" className="text-primary">Add new method</Button>
              </div>
              <RadioGroup defaultValue="visa" className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src="/placeholder.svg" alt="Visa" className="w-8 h-8" />
                    <div>
                      <div className="font-medium">Visa **** 0912</div>
                      <div className="text-sm text-muted-foreground">Wrap your items</div>
                    </div>
                  </div>
                  <RadioGroupItem value="visa" id="visa" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src="/placeholder.svg" alt="Mastercard" className="w-8 h-8" />
                    <div>
                      <div className="font-medium">Mastercard **** 0912</div>
                      <div className="text-sm text-muted-foreground">Wrap your items for</div>
                    </div>
                  </div>
                  <RadioGroupItem value="mastercard" id="mastercard" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src="/placeholder.svg" alt="Tabby" className="w-8 h-8" />
                    <div>
                      <div className="font-medium">Pay with Tabby</div>
                      <div className="text-sm text-muted-foreground">Wrap your items for</div>
                    </div>
                  </div>
                  <RadioGroupItem value="tabby" id="tabby" />
                </div>
              </RadioGroup>
            </Card>

            {/* Cart Items */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Cart <span className="text-muted-foreground">3 items</span></h2>
                <Button variant="link" className="text-destructive">Remove all</Button>
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-4">
                    <img
                      src="/placeholder.svg"
                      alt="Nike Jacket"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Nike Dri-Fit Training Jacket Summer Special Kit</div>
                          <div className="text-sm text-muted-foreground">XL • Black</div>
                          <div className="text-sm text-muted-foreground">SAR 40.00 per item</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(`item${item}`, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{quantities[`item${item}`]}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(`item${item}`, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-right font-medium">
                        SAR 80.00
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">Use Credit for this purchase</h2>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Switch />
                </div>
                <div className="text-sm">
                  Available balance: <span className="text-green-600">SAR 6000</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Your Pixcommerce credit are not sufficient to pay for the order, please select an additional payment method to cover the balance of <span className="text-red-500">SAR 500</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">Make it a Gift</h2>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Switch />
              </div>
              <div className="text-sm text-muted-foreground">
                Wrap your items for SAR 20
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold mb-4">Discount code</h2>
              <div className="flex items-center gap-2 mb-4">
                <Input value="PIX120%" readOnly />
                <Button variant="outline" className="shrink-0">
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <div className="text-sm text-green-600">Coupon code is valid!</div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal (11 items)</span>
                  <span>SAR 60.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total (with VAT)</span>
                  <span>SAR 330.00</span>
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-500/90">Checkout</Button>
                <div className="flex items-center justify-center gap-4">
                  <img src="/placeholder.svg" alt="Visa" className="h-6" />
                  <img src="/placeholder.svg" alt="Mastercard" className="h-6" />
                  <img src="/placeholder.svg" alt="Cash" className="h-6" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}