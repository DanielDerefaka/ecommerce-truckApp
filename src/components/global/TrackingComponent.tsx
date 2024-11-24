"use client"

import * as React from "react"
import { MapPin, Phone, MessageSquare, RefreshCw, Search, Settings, Menu, Package, Plus, Minus, AlertCircle, CheckCircle2, TruckIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { getOrderByPaymentIntentId } from "@/lib/queries"
import { OrderStatus } from "@prisma/client"

interface TrackingPageProps {
  paymentIntentId?: string;
}

const statusMessages = {
  [OrderStatus.PENDING]: "Order is pending confirmation",
  [OrderStatus.PROCESSING]: "Package is being prepared for shipment",
  [OrderStatus.SHIPPED]: "Package is in transit to delivery address",
  [OrderStatus.DELIVERED]: "Package has been successfully delivered",
  [OrderStatus.CANCELLED]: "Order has been cancelled",
}

const statusColors = {
  [OrderStatus.PENDING]: "text-yellow-500",
  [OrderStatus.PROCESSING]: "text-blue-500",
  [OrderStatus.SHIPPED]: "text-purple-500",
  [OrderStatus.DELIVERED]: "text-green-500",
  [OrderStatus.CANCELLED]: "text-red-500",
}



const MapView = ({ status, origin, destination }) => {
    // Calculate the progress percentage based on status
    const getDeliveryProgress = (status: OrderStatus) => {
      const progressMap = {
        [OrderStatus.PENDING]: 0,
        [OrderStatus.PROCESSING]: 0.2,
        [OrderStatus.SHIPPED]: 0.6,
        [OrderStatus.DELIVERED]: 1,
        [OrderStatus.CANCELLED]: 0,
      }
      return progressMap[status] || 0
    }
  
    const progress = getDeliveryProgress(status)
  
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-50 p-4">
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* Map Background Grid */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
  
          {/* Warehouse Location */}
          <circle cx="80" cy="200" r="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="80" cy="200" r="20" fill="#e2e8f0" fillOpacity="0.3" />
  
          {/* Destination Location */}
          <circle cx="320" cy="200" r="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          <circle cx="320" cy="200" r="20" fill="#e2e8f0" fillOpacity="0.3" />
  
          {/* Delivery Path */}
          <path
            d="M 80 200 C 140 200, 260 200, 320 200"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeDasharray="4 4"
          />
  
          {/* Active Path (animated) */}
          <path
            d="M 80 200 C 140 200, 260 200, 320 200"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray="240"
            strokeDashoffset="240"
            style={{
              strokeDashoffset: 240 - (240 * progress),
              transition: "stroke-dashoffset 1s ease-in-out"
            }}
          />
  
          {/* Delivery Vehicle */}
          {status !== OrderStatus.DELIVERED && status !== OrderStatus.CANCELLED && (
            <g
              transform={`translate(${80 + (240 * progress) - 15}, 185)`}
              style={{ transition: "transform 1s ease-in-out" }}
            >
              <rect
                width="30"
                height="20"
                rx="4"
                fill="#3b82f6"
              />
              <rect
                x="20"
                y="5"
                width="10"
                height="10"
                rx="2"
                fill="#1d4ed8"
              />
            </g>
          )}
  
          {/* Location Labels */}
          <g transform="translate(65, 240)">
            <text
              textAnchor="middle"
              className="text-xs font-medium"
              fill="#64748b"
            >
              Warehouse
            </text>
          </g>
          <g transform="translate(320, 240)">
            <text
              textAnchor="middle"
              className="text-xs font-medium"
              fill="#64748b"
            >
              Destination
            </text>
          </g>
        </svg>
  
        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="bg-white/90 shadow-md">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-white/90 shadow-md">
            <MapPin className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-white/90 shadow-md">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-white/90 shadow-md">
            <Minus className="h-4 w-4" />
          </Button>
        </div>
  
        {/* Delivery Info Card */}
        <Card className="absolute bottom-4 left-4 w-64 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <TruckIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {status === OrderStatus.DELIVERED ? 'Delivered' : 'In Transit'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {status === OrderStatus.DELIVERED 
                    ? 'Package has arrived at destination'
                    : status === OrderStatus.CANCELLED
                    ? 'Delivery cancelled'
                    : 'Package is on its way'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }


export default function TrackingPage({ paymentIntentId }: TrackingPageProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchId, setSearchId] = useState(paymentIntentId || "")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrderByPaymentIntentId(id)
      if (!data) {
        throw new Error("Order not found")
      }
      setOrder(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to fetch order:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch order details")
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (paymentIntentId) {
      fetchOrder(paymentIntentId)
    }
  }, [paymentIntentId])

  // Auto-refresh for non-final statuses
  useEffect(() => {
    if (!autoRefresh || !order || !order.paymentIntentId) return
    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) return

    const interval = setInterval(() => {
      fetchOrder(order.paymentIntentId)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, order])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim()) {
      setError("Please enter a tracking ID")
      return
    }
    fetchOrder(searchId.trim())
  }

  const getDeliveryTime = (status: OrderStatus, estimatedDelivery?: Date) => {
    if (status === OrderStatus.DELIVERED) {
      return "Delivered"
    }
    if (status === OrderStatus.CANCELLED) {
      return "Cancelled"
    }
    if (estimatedDelivery) {
      return `Expected ${estimatedDelivery.toLocaleDateString()} at ${estimatedDelivery.toLocaleTimeString()}`
    }
    return "Estimated delivery pending"
  }

  const getProgressPercentage = (status: OrderStatus) => {
    const statusValues = {
      [OrderStatus.PENDING]: 20,
      [OrderStatus.PROCESSING]: 40,
      [OrderStatus.SHIPPED]: 70,
      [OrderStatus.DELIVERED]: 100,
      [OrderStatus.CANCELLED]: 0,
    }
    return statusValues[status]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Package className="h-6 w-6 text-primary" />
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Enter tracking ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="pl-4 pr-10"
                  disabled={loading}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {order ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              {/* Order Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">
                    {order.items?.[0]?.product?.name || "Package"}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                      aria-label="Auto-refresh"
                    />
                    <span className="text-sm text-muted-foreground">Auto-refresh</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tracking ID: {order.id}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  Last updated: {lastRefresh.toLocaleString()}
                </div>
              </div>

              {/* Status Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className={`font-medium ${statusColors[order.status]}`}>
                          {statusMessages[order.status]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getDeliveryTime(order.status, order.estimatedDelivery)}
                        </p>
                      </div>
                      {order.status === OrderStatus.DELIVERED && (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${getProgressPercentage(order.status)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Details */}
              {order.shippingAddress && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div className="space-y-1">
                          <h3 className="font-medium">Delivery Address</h3>
                          <p className="text-sm">{order.shippingAddress.street}</p>
                          <p className="text-sm">
                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p className="text-sm">{order.shippingAddress.country}</p>
                        </div>
                      </div>
                      
                      {order.status !== OrderStatus.DELIVERED && (
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact Support
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Phone className="mr-2 h-4 w-4" />
                            Call Courier
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Delivery Timeline */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Delivery Updates</h2>
                <div className="relative space-y-6 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-12px)] before:w-[2px] before:bg-muted">
                  {Object.entries(OrderStatus)
                    .filter(([key]) => OrderStatus[key as keyof typeof OrderStatus] <= order.status)
                    .map(([key, value], index) => (
                      <div key={key} className="relative">
                        <div
                          className={`absolute -left-8 h-6 w-6 rounded-full border-4 transition-colors ${
                            value === order.status
                              ? "border-primary bg-background"
                              : "border-muted bg-muted"
                          }`}
                        />
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                          <p className="font-medium">
                            {statusMessages[value as OrderStatus]}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="relative h-[600px] rounded-lg bg-muted lg:h-full">
        <MapView 
          status={order?.status} 
          origin={order?.warehouseAddress}
          destination={order?.shippingAddress}
        />
      </div>
          </div>
        ) : !loading && !error && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-medium">Track Your Package</h2>
            <p className="text-center text-muted-foreground">
              Enter your tracking ID above to see your delivery status
            </p>
          </div>
        )}
      </main>
    </div>
  )
}