'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Plus, Minus } from 'lucide-react'
import { getCart, updateCartItemQuantity, removeFromCart } from '@/lib/queries'
import Image from 'next/image'

// Types remain the same
interface Product {
  id: string
  name: string
  price: number
  images: { url: string }[]
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

interface CartData {
  userId: string
  items: CartItem[]
}

interface CartResponse {
  success: boolean
  data?: CartData
  error?: string
}

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-pulse">Loading cart...</div>
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-red-500 flex items-center gap-2">
      <span>Error:</span> {message}
    </div>
  </div>
)

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating
}: {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  isUpdating: boolean
}) => (
  <div className={`flex gap-4 ${isUpdating ? 'opacity-60' : ''}`}>
    <Image
      src={item.product.images[0]?.url || "/placeholder.svg"}
      alt={item.product.name}
      className="w-24 h-24 object-cover rounded-lg"
      width={200}
      height={200}
    />
    <div className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{item.product.name}</div>
          <div className="text-sm text-muted-foreground">
            SAR {item.product.price.toFixed(2)} per item
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(item.productId)}
          disabled={isUpdating}
          className="text-red-500 hover:text-red-600"
        >
          Remove
        </Button>
        <div className="font-medium">
          SAR {(item.product.price * item.quantity).toFixed(2)}
        </div>
      </div>
    </div>
  </div>
)

const OrderSummary = ({
  items,
  subtotal
}: {
  items: CartItem[]
  subtotal: number
}) => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Subtotal ({items.length} items)
        </span>
        <span>SAR {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span className="text-green-600">Free</span>
      </div>
      <div className="flex justify-between font-medium">
        <span>Total (with VAT)</span>
        <span>SAR {(subtotal * 1.15).toFixed(2)}</span>
      </div>
      <Button className="w-full bg-red-500 hover:bg-red-500/90">
        Checkout
      </Button>
      <div className="flex items-center justify-center gap-4">
        <img src="/placeholder.svg" alt="Visa" className="h-6" />
        <img src="/placeholder.svg" alt="Mastercard" className="h-6" />
        <img src="/placeholder.svg" alt="Cash" className="h-6" />
      </div>
    </div>
  </Card>
)

export default function CartPage() {
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCartData()
  }, [])

  const loadCartData = async () => {
    try {
      setLoading(true)
      const response: CartResponse = await getCart()
      if (response.success && response.data) {
        setCartData(response.data)
        setError(null)
      } else {
        setError(response.error || 'Failed to load cart')
      }
    } catch (err) {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    if (!cartData?.userId || newQuantity < 1) return

    // Optimistically update the UI
    setUpdatingItems(prev => new Set(prev).add(productId))
    setCartData(prev => {
      if (!prev) return null
      return {
        ...prev,
        items: prev.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
    })

    try {
      const response = await updateCartItemQuantity(cartData.userId, productId, newQuantity)
      if (!response.success) {
        // Revert on failure
        await loadCartData()
        setError(response.error || 'Failed to update quantity')
      }
    } catch (err) {
      await loadCartData()
      setError('Failed to update quantity')
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    if (!cartData?.userId) return

    // Optimistically update the UI
    setUpdatingItems(prev => new Set(prev).add(productId))
    setCartData(prev => {
      if (!prev) return null
      return {
        ...prev,
        items: prev.items.filter(item => item.productId !== productId)
      }
    })

    try {
      const response = await removeFromCart(cartData.userId, productId)
      if (!response.success) {
        // Revert on failure
        await loadCartData()
        setError(response.error || 'Failed to remove item')
      }
    } catch (err) {
      await loadCartData()
      setError('Failed to remove item')
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const calculateSubtotal = () => {
    if (!cartData?.items) return 0
    return cartData.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!cartData) return <ErrorState message="No cart data available" />

  const subtotal = calculateSubtotal()

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <p className="text-sm text-muted-foreground">
                      Add an address so we can get tracking on the delivery!
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add new locations
              </Button>
            </Card>

            {/* Cart Items */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">
                  Cart <span className="text-muted-foreground">
                    {cartData.items.length} items
                  </span>
                </h2>
                <Button 
                  variant="link" 
                  className="text-destructive"
                  onClick={() => cartData.items.forEach(item => handleRemoveItem(item.productId))}
                >
                  Remove all
                </Button>
              </div>
              <div className="space-y-6">
                {cartData.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleQuantityUpdate}
                    onRemove={handleRemoveItem}
                    isUpdating={updatingItems.has(item.productId)}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <OrderSummary items={cartData.items} subtotal={subtotal} />
          </div>
        </div>
      </main>
    </div>
  )
}