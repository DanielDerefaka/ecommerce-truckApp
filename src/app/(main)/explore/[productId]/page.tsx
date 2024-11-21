import ProductPage from '@/components/global/site/SpecificProduct'
import { getProductsbyId } from '@/lib/queries';
import React from 'react'

const Page = async ({ params }: { params: { productId: string } }) => {

  if (!params.productId) {
    throw new Error('Product ID is required');

  }


  const id  = params.productId;

 

  try {
    const product = await getProductsbyId(id);

    return (
      <div>
        {/* {id.id} */}
       
        <ProductPage  product={product} />
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        Error: {error instanceof Error ? error.message : 'Failed to load product'}
      </div>
    );
  }
}

export default Page;