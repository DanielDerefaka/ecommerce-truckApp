"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { createOrder, updateOrderStatus } from "@/lib/queries";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useUser } from "@clerk/nextjs";
import { CartItem } from "@prisma/client";


interface CheckoutFormProps {
  amount: number;
  items: CartItem[];
}

export default function CheckoutForm({ amount, items }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !user) {
      return;
    }

    try {
      // Create the order first
      const order = await createOrder({
        amount: convertToSubcurrency(amount),
        email: user.emailAddresses[0].emailAddress,
        items,
      });

      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message);
        await updateOrderStatus(order?.id, "CANCELLED");
        setLoading(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?orderId=${order.id}`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        await updateOrderStatus(order.id, "PROCESSING");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
       
             <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
}