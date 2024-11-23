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
  selectedAddress: any;
}

export default function CheckoutForm({ amount, items, selectedAddress }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    if (!stripe || !elements || !user) {
      setErrorMessage("Payment initialization failed. Please refresh the page.");
      setLoading(false);
      return;
    }

    if (!user.emailAddresses?.[0]?.emailAddress) {
      setErrorMessage("Email address is required");
      setLoading(false);
      return;
    }

    try {
      // Create the order first
      const orderResponse = await createOrder({
        amount: convertToSubcurrency(amount),
        email: user.emailAddresses[0].emailAddress,
        items,
        selectedAddress
      });

      if (!orderResponse || !orderResponse.id) {
        throw new Error("Failed to create order");
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?orderId=${orderResponse.id}`,
        },
      });

      if (paymentError) {
        await updateOrderStatus(orderResponse.id, "PROCESSING");
        throw new Error(paymentError.message);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      console.error("Checkout error:", error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 mt-4 text-sm font-medium">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
}