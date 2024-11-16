import { Address, Order, User } from "@prisma/client";

export type UserDetailsResponse = {
    success: boolean;
    data: UserWithDetails | null;
    error?: string;
  };


  export type UserWithDetails = User & {
    orders?: (Order & {
      items: {
        quantity: number;
        price: number;
        product: {
          name: string;
          images: string[];
        };
      }[];
    })[];
    addresses?: Address[];
    cart?: {
      items: {
        quantity: number;
        product: {
          id: string;
          name: string;
          price: number;
          images: string[];
        };
      }[];
    };
    wishlist?: {
      items: {
        product: {
          id: string;
          name: string;
          price: number;
          images: string[];
        };
      }[];
    };
  };