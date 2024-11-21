
// app/products/product-card.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Product, Category } from "@prisma/client"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Button } from "../ui/button"

type ProductWithCategory = Product & {
  category: Category
}

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
            </div>
            <Badge variant={product.stock > 10 ? "default" : "destructive"}>
              {product.stock} in stock
            </Badge>
          </div>
          <p className="mt-2 text-sm line-clamp-2 text-gray-500">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-xl font-bold">
            {formatPrice(product.price)}
          </span>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
