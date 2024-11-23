"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import {
  type User,
  type Address,
  CartItem,
  OrderStatus,
  Order,
} from "@prisma/client";
import { redirect } from "next/navigation";

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

type CartResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

type DeleAddress = {
  success: boolean;
  data?: any;
  error?: string;
};

interface DeleteAddressResponse {
  success: boolean;
  error?: string;
}

interface AddressData {
  id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  name?: string;
}

interface Address extends AddressData {
  id: string;
  userId: string;
}

interface AddressInput {
  street: string;
  city: string;
  state: string;
  postalCode: string; // Added missing field
  country: string; // Added missing field
}

type CreateOrderInput = {
  amount: number;
  email?: string;
  items: CartItem[];
  paymentIntentId?: string;
  shippingAddress?: string;
  productId?: string;
  selectedAddress: AddressInput;
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
export const getUserByClerkId = async (
  clerkId: string
): Promise<AuthUserResponse> => {
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

export async function getUserDetails(
  userId: string
): Promise<UserDetailsResponse> {
  try {
    const userDetails = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        addresses: {
          select: {
            id: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            isDefault: false,
          },
        },
        orders: {
          select: {
            id: true,
            createdAt: true,
            status: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: true,
              },
            },

            // Include any other order fields you need
          },
          orderBy: {
            createdAt: "desc",
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
      error:
        error instanceof Error ? error.message : "Failed to fetch user details",
    };
  }
}

export async function getProducts() {
  try {
    const products = await client.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        miles: true,
        loction: true,
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// export async function getProductsbyId(id: string) {
//   try {
//     const products = await client.product.findUnique({
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         price: true,
//         stock: true,
//         categoryId: true,
//         miles: true,
//         loction: true,
//         images: {
//           select: {
//             id: true,
//             url: true
//           }
//         },
//       },
//       where: {
//         id: id
//       }
//     });

//     return { success: true, data: products };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       success: false,
//       error: "Failed to fetch products",
//       details: error instanceof Error ? error.message : "Unknown error occurred"
//     };
//   }
// }

// export async function getProductsbyId(id: string) {
//   try {
//     const product = await client.product.findUnique({
//       where: {
//         id: id, // Ensure `id` is passed correctly as a string
//       },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         price: true,
//         stock: true,
//         categoryId: true,
//         miles: true,
//         loction: true,
//         images: {
//           select: {
//             id: true,
//             url: true,
//           },
//         },
//       },
//     });

//     if (!product) {
//       return { success: false, error: "Product not found" };
//     }

//     return { success: true, data: product };
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return {
//       success: false,
//       error: "Failed to fetch product",
//       details: error instanceof Error ? error.message : "Unknown error occurred",
//     };
//   }
// }

export async function getProductsbyId(productid: string) {
  console.log(productid);
  try {
    const product = await client.product.findUnique({
      where: {
        id: productid,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        miles: true,
        loction: true, // Note: I corrected 'loction' to 'location'
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getSimilarProducts(
  categoryId: string,
  currentProductId: string
) {
  try {
    const similarProducts = await client.product.findMany({
      where: {
        categoryId: categoryId,
        id: { not: currentProductId },
      },
      take: 4,
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
    });

    return similarProducts;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
}

// Add item to cart
export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartResponse> {
  const main = await currentUser();

  if (!main) {
    // redirect('/sign-in')
    return { error: "You must be logged in to add items to cart" };
  } else {
    console.log("User ID:", main.id); // This will log: user_2ouKHl6e2gtFipmrakrWBJkLeW8
  }

  const userId = main.id;

  try {
    // First, get or create the user's cart
    const cart = await client.cart.upsert({
      where: {
        userId: userId,
      },
      create: {
        userId: userId,
      },
      update: {},
    });

    // Then, add or update the cart item
    const cartItem = await client.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
      create: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return {
      success: true,
      data: cartItem,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add to cart",
    };
  }
}

// Get cart contents
export async function getCart(): Promise<CartResponse> {
  const main = await currentUser();

  if (!main) {
    console.log("no user found");
  } else {
    console.log("User ID:", main.id); // This will log: user_2ouKHl6e2gtFipmrakrWBJkLeW8
  }

  const userId = main.id;

  if (!userId) return redirect("/sign-in");

  try {
    const cart = await client.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    if (!cart) {
      return {
        success: false,
        error: "Cart not found",
      };
    }

    // Get product details for each cart item
    const cartWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await client.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        });
        return {
          ...item,
          product,
        };
      })
    );

    return {
      success: true,
      data: {
        ...cart,
        items: cartWithProducts,
      },
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cart",
    };
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartResponse> {
  try {
    const cart = await client.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      return {
        success: false,
        error: "Cart not found",
      };
    }

    const updatedItem = await client.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
      data: {
        quantity: quantity,
      },
    });

    return {
      success: true,
      data: updatedItem,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update cart item",
    };
  }
}

// Remove item from cart
export async function removeFromCart(
  userId: string,
  productId: string
): Promise<CartResponse> {
  try {
    const cart = await client.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      return {
        success: false,
        error: "Cart not found",
      };
    }

    await client.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to remove from cart",
    };
  }
}

export async function DeleteAddress(
  id: string
): Promise<DeleteAddressResponse> {
  if (!id) {
    return {
      success: false,
      error: "Address ID is required",
    };
  }

  try {
    // First check if the address exists
    const address = await client.address.findUnique({
      where: { id },
    });

    if (!address) {
      return {
        success: false,
        error: "Address not found",
      };
    }

    // Delete the address
    await client.address.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error Deleting Address:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to Delete Address",
    };
  }
}
export async function getAddress() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Changed to findMany to get all user addresses
    const addresses = await client.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        isDefault: "desc", // Default addresses first
      },
    });

    return {
      success: true,
      addresses,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return {
      success: false,
      error: "Failed to fetch addresses",
    };
  }
}

export async function addAddress(data: AddressData) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // If this is the first address or marked as default, handle existing default
    if (data.isDefault) {
      await client.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await client.address.create({
      data: {
        ...data,
        id: data.id || undefined,
        userId: user.id,
        isDefault: data.isDefault || false,
      },
    });

    return {
      success: true,
      address,
    };
  } catch (error) {
    console.error("Error creating address:", error);
    return {
      success: false,
      error: "Failed to create address",
    };
  }
}

// Create a new order
export async function createOrder(input: CreateOrderInput) {
  try {
    // Get current user
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Validate address
    const { selectedAddress: address } = input;
    if (
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.postalCode ||
      !address?.country
    ) {
      return {
        success: false,
        error: "Invalid shipping address. All fields are required.",
      };
    }

    // Validate items
    if (!input.items?.length) {
      return {
        success: false,
        error: "Order must contain at least one item",
      };
    }

    // Create order with related data
    const order = await client.order.create({
      data: {
        userId: user.id,
        amount: input.amount,
        email: input.email,
        paymentIntentId: input.paymentIntentId,
        status: OrderStatus.PENDING,
        shippingAddress: {
          create: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: true,
          },
        },
        items: {
          create: input.items.map((item) => ({
            quantity: item.quantity,
            price: 100, // Note: You might want to get the actual price from the product
            product: {
              connect: { id: item.productId },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(order.id);
    // Attempt to clear cart items
    try {
      await Promise.all(
        input.items.map((item) => removeFromCart(user.id, item.productId))
      );
    } catch (cartError) {
      console.error("Error removing items from cart:", cartError);
      // Continue since order was created successfully
    }

    return {
      success: true,
      data: order,
      id: order.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  return client.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

// Get orders by user ID
export async function getUserOrders() {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  const userId = user.id;

  return client.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// export async function getUserOrderbyId(id : string) {


  // return client.order.findFirst({
  //   where: { id: id},

  //   select: {

  //   },

  //   include: {
  //     items: {
  //       include: {
  //         product: {
  //           include: {
  //             images: true,
  //           },
  //         },
  //       },
  //     },
  //   },
   
  // });
// }


export async function getUserOrderbyId(id: string) {
  console.log(id.id);

  const orderId = id.id
  try {
    const product = await client.order.findUnique({
      where: {
        id : orderId,
      },
      select: {
        id: true,
        amount: true,
        status: true,
        items: {
          include: {
            product: {
              include: {
                images: true
                
              }
            }

          }
        },
        shippingAddress: true,
                
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}









// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return client.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

// Update payment intent ID
export async function updatePaymentIntent(
  orderId: string,
  paymentIntentId: string
) {
  return client.order.update({
    where: { id: orderId },
    data: {
      paymentIntentId,
      status: OrderStatus.PROCESSING, // Optionally update status when payment intent is added
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

// Get order by payment intent ID
export async function getOrderByPaymentIntent(paymentIntentId: string) {
  return client.order.findUnique({
    where: { paymentIntentId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
