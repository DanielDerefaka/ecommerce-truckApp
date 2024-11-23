import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// app/types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}
