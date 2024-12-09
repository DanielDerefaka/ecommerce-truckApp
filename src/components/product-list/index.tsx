'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProduct } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Product = {
  id: string
  name: string
  price: number
  stock: number
  location: string
  images: { id: string; url: string }[]
}

interface Props {
  products: Product[]
}

export default function ProductList({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (productId: string) => {
    // Additional null/undefined check
    if (!productId) {
      toast.error('Invalid product ID')
      return
    }

    try {
      setIsDeleting(productId)
      
      // Ensure we're passing a valid string ID
      const result = await deleteProduct(productId.toString())
      
      if (result?.success) {
        // Filter out the deleted product
        const updatedProducts = products.filter(product => product.id !== productId)
        setProducts(updatedProducts)
        
        toast.success('Product deleted successfully')
        router.refresh()
      } else {
        // Use optional chaining to safely access error
        toast.error(result?.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Deletion error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="border rounded-lg p-4 flex flex-col"
            >
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover rounded mb-4"
                />
              )}
              
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">Location: {product.location}</p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="mt-4 w-full"
                    disabled={isDeleting === product.id}
                  >
                    {isDeleting === product.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Delete Product'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the product. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}