

import { getProductsAll } from '@/lib/queries'
import ProductList from '../../../components/product-list'

export default async function ProductsPage() {
  const { products, error } = await getProductsAll()

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ProductList products={products} />
    </div>
  )
}

