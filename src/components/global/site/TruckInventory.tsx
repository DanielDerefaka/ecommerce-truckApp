
'use client'

import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Grid, List, ArrowUpDown, X } from 'lucide-react'
import { getProducts } from '@/lib/queries'
import Image from 'next/image'
import Link from 'next/link'

const truckTypes = [
  "C & C",
  "Conventional W/ Sleeper",
  "Day Cab",
  "Dump Truck",
  "Roll Off",
  "Spotter / Yard Dog",
  "Straight Moving Van",
  "Straight Truck Dry Van"
]

export default function TruckInventory() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeFilters, setActiveFilters] = useState(8)
  const [priceRange, setPriceRange] = useState([2000, 200000])
  const [mileageRange, setMileageRange] = useState([0, 2000000])

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getProducts();
        if (response.success) {
          setProducts(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Search Header */}
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Enter Stock No."
            className="max-w-xs"
          />
          <Button>Find</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Search Inventory</h2>
              
              <div className="flex gap-2 mb-6">
                <Button className="flex-1" variant="default">Trucks</Button>
                <Button className="flex-1" variant="outline">Trailers</Button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Currently Viewing:</span>
                <Badge variant="secondary">{activeFilters}</Badge>
                <Button variant="ghost" size="sm" className="text-primary">
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[2000, 200000]}
                      max={200000}
                      min={2000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Mileage Range</label>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 2000000]}
                      max={2000000}
                      min={0}
                      step={10000}
                      value={mileageRange}
                      onValueChange={setMileageRange}
                    />
                    <div className="flex justify-between text-sm">
                      <span>{mileageRange[0].toLocaleString()}</span>
                      <span>{mileageRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="space-y-2">
                    {truckTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={type} />
                        <label htmlFor={type} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Used trucks for sale in the United States</h1>
              
              <div className="flex items-center justify-between mb-6">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-muted-foreground">Results: 616</span>
                </div>
              </div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {products.map((product, index) => (
                <Link href={`/explore/${product.id}?id=${product.id}`} key={product.id
                }  className='cursor-pointer'>
                  <Card className="overflow-hidden">
                    <div className="relative">
                    {product.images && product.images.length > 0 && (
                      <Image
                        src={product.images[0].url} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        width={500}
                        height={500}
                      />
                    )}

                    <p>{product.images.url}</p>
                      <Badge className="absolute top-2 right-2 bg-red-600">
                        PROMOTION
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="text-2xl font-bold text-primary">${product.price}</div>
                        <div className="flex items-center text-muted-foreground">
                          <ArrowUpDown className="h-4 w-4 mr-1" />
                         {product.miles} Miles
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {product.loction}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Stock # {product.stock}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}