"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import CheckoutForm from "./StripeTest";
import { CartItem } from "@prisma/client";

// Make sure to replace with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CheckoutWrapperProps {
  amount: number;
  items: CartItem[];
}

export default function CheckoutWrapper({ amount, items }: CheckoutWrapperProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: convertToSubcurrency(amount),
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm amount={amount} items={items} />
        </Elements>
      )}
    </div>
  );
}