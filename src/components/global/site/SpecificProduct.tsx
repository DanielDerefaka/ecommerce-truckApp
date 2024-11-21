'use client'

import Image from "next/image"
import { useState } from "react"
import { MinusIcon, PlusIcon, StarIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDetailPage({ product }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-[#e8f0ff]">
            <Image
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.name}
              className="object-cover"
              fill
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(0, 4).map((image, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.name} view ${i + 1}`}
                  className="object-cover"
                  fill
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">(2,477 reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              <Badge variant="secondary">Limited quantity available</Badge>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Quantity:</label>
              <div className="flex w-32 items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="font-medium">Product Description</p>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="font-medium">Additional Information</p>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Category: {product.categoryId}</li>
                    <li>• Stock: {product.stock} units</li>
                    <li>• Location: {product.loction}</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Product Highlights</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Earn {product.miles} miles with this purchase</li>
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button className="w-full" size="lg">
                Add to cart
              </Button>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Free 2-day delivery</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Free pickup at {product.loction}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}