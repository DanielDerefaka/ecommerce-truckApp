'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCart } from '@/lib/queries';
import { useRouter } from 'next/navigation';

const CartButton = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCartItemsCount = async () => {
    try {
      setIsLoading(true);
      const cart = await getCart();
      
      if (cart.success && cart.data) {
        const totalItems = cart.data.items.reduce(
          (sum, item) => sum + item.quantity, 
          0
        );
        setCartItemsCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItemsCount();

    // Listen for route changes to refresh cart count
    router.events?.on('routeChangeComplete', fetchCartItemsCount);
    
    // Set up interval for periodic updates
    const interval = setInterval(fetchCartItemsCount, 5000);

    return () => {
      router.events?.off('routeChangeComplete', fetchCartItemsCount);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <ShoppingCart size={18} />
        {!isLoading && cartItemsCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
            key={cartItemsCount} // Add key for smooth animation
          >
            {cartItemsCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;