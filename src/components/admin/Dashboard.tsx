"use client"
import { useState, useEffect } from 'react'
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

const topCountries = [
  { name: "Australia", flag: "🇦🇺", value: "34.48K" },
  { name: "Belgium", flag: "🇧🇪", value: "28.67K" },
  { name: "Canada", flag: "🇨🇦", value: "25.12K" }
]

export default function DashboardPage({ user }:any) {
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

  if (isLoading) return <div>Loading...</div>;

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
            <Input className="w-64 pl-8" placeholder="Search..." type="search" />
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+30% </span>
              this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$30.58K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">-15% </span>
              this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.48K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+23% </span>
              this month
            </p>
          </CardContent>
        </Card>
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
              {topCountries.map((country) => (
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
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url} 
                          alt={product.name} 
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-gray-100" />
                      )}
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
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