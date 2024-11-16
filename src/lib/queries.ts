"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import { type User, type Order, type Address } from "@prisma/client";

type AuthUserResponse = {
  success: boolean;
  data: User | null;
  error?: string;
};

type UserDetailsResponse = {
  success: boolean;
  data: UserWithDetails | null;
  error?: string;
};


export const getAuthUserDetails = async (): Promise<AuthUserResponse> => {
  try {
    const user = await currentUser();
    
    if (!user) {
      return {
        success: false,
        data: null,
        error: "Not authenticated",
      };
    }

    // Get the primary email
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      return {
        success: false,
        data: null,
        error: "No primary email found",
      };
    }

    const dbUser = await client.user.upsert({
      where: {
        clerkId: user.id,
      },
      update: {
        email: primaryEmail.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      create: {
        clerkId: user.id,
        email: primaryEmail.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    return {
      success: true,
      data: dbUser,
    };

  } catch (error) {
    console.error("Error in getAuthUserDetails:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Helper function to check if user exists
export const checkUserExists = async (clerkId: string): Promise<boolean> => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId,
      },
    });
    return !!user;
  } catch {
    return false;
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (clerkId: string): Promise<AuthUserResponse> => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        cart: true,
        wishlist: true,
      },
    });

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };

  } catch (error) {
    console.error("Error in getUserByClerkId:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};


type UserWithDetails = User & {
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

export async function getUserDetails(userId: string): Promise<UserDetailsResponse> {
  try {
    const userDetails = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        addresses: {
         
        },
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        cart: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        wishlist: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userDetails) {
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    }

    return {
      success: true,
      data: userDetails,
    };

  } catch (error) {
    console.error("Error fetching user details:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch user details",
    };
  }
}

// Get user's order history
export async function getUserOrders(userId: string) {
  try {
    const orders = await client.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
        tracking: true,
      },
    });

    return {
      success: true,
      data: orders,
    };

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

// Get user's addresses
export async function getUserAddresses(userId: string) {
  try {
    const addresses = await client.address.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return {
      success: true,
      data: addresses,
    };

  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch addresses",
    };
  }
}

// Get user's cart with products
export async function getUserCart(userId: string) {
  try {
    const cart = await client.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: cart,
    };

  } catch (error) {
    console.error("Error fetching user cart:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch cart",
    };
  }
}

// Get user's wishlist with products
export async function getUserWishlist(userId: string) {
  try {
    const wishlist = await client.wishlist.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: wishlist,
    };

  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch wishlist",
    };
  }
}