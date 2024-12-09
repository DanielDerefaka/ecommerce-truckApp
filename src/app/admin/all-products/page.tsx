import { Suspense } from 'react'
import { getProductsAll } from '@/lib/queries'
import ProductList from '../../../components/product-list'
import { Loader2 } from 'lucide-react'

// Loading component for Suspense
function ProductListFallback() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )
}

export default async function ProductsPage() {
  const { products, error } = await getProductsAll()

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<ProductListFallback />}>
        <ProductList products={products} />
      </Suspense>
    </div>
  )
}