"use client"
import { useState, useEffect, useMemo } from 'react'
import { Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserButton } from '@clerk/nextjs'
import { getProducts } from '@/lib/queries'
import Image from 'next/image'

// Memoized and typed top countries data
const TOP_COUNTRIES = [
  { name: "Australia", flag: "🇦🇺", value: "34.48K" },
  { name: "Belgium", flag: "🇧🇪", value: "28.67K" },
  { name: "Canada", flag: "🇨🇦", value: "25.12K" }
] as const;

// Type definitions for better type safety
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { url: string }[];
}

// Performance-optimized dashboard component
export default function DashboardPage({ user }: { user: { firstName: string } }) {
  // Use React.memo if this becomes a performance bottleneck
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized data fetching with error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.success) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures one-time fetch

  // Memoized and filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Early return for loading state with skeleton loader
  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-20 bg-gray-200 mb-6 rounded"></div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(card => (
            <div key={card} className="bg-gray-200 h-32 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back, {user.firstName}</h1>
          <p className="text-sm text-gray-500">Here's what happening with your store today</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              className="w-64 pl-8" 
              placeholder="Search products..." 
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarFallback>
              <UserButton/>
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Total Customer", value: "1.8K", change: "+30%", color: "text-green-500" },
          { title: "Total Revenue", value: "$30.58K", change: "-15%", color: "text-red-500" },
          { title: "Total Deals", value: "2.48K", change: "+23%", color: "text-green-500" }
        ].map(metric => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.color}>{metric.change} </span>
                this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full rounded-xl bg-gradient-to-r from-gray-50 to-gray-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TOP_COUNTRIES.map((country) => (
                <div key={country.name} className="flex items-center">
                  <div className="w-8 text-2xl">{country.flag}</div>
                  <div className="ml-2 flex-1">{country.name}</div>
                  <div>{country.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top selling products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/NO</TableHead>
                <TableHead>Product Name</TableHead>
                {/* <TableHead>Description</TableHead> */}
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url} 
                          alt={product.name} 
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-gray-100" />
                      )}
                      {product.name}
                    </div>
                  </TableCell>
                  {/* <TableCell>{product.description}</TableCell> */}
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        (product.stock || 0) > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock} Items
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

