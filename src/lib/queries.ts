"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import { type User, type Address } from "@prisma/client";

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

interface AddressData {
  id?: string; // Optional
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean; // Optional
}


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
      }
       
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
            url: true
          }
        },
        
      }
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : "Unknown error occurred"
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
  console.log(productid)
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
            url: true
          }
        }
      }
    });
    
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}


export async function getSimilarProducts(categoryId: string, currentProductId: string) {
  try {
    const similarProducts = await client.product.findMany({
      where: {
        categoryId: categoryId,
        id: { not: currentProductId }
      },
      take: 4,
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          select: {
            url: true
          },
          take: 1
        }
      }
    })
    
    return similarProducts
  } catch (error) {
    console.error("Error fetching similar products:", error)
    throw error
  }
}



// Add item to cart
export async function addToCart(


  productId: string,
  quantity: number
): Promise<CartResponse> {

  const main = await currentUser();

  if (!main) {
    console.log('no user found');
  } else {
    console.log('User ID:', main.id);  // This will log: user_2ouKHl6e2gtFipmrakrWBJkLeW8
  }

  const userId = main.id


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
    console.log('no user found');
  } else {
    console.log('User ID:', main.id);  // This will log: user_2ouKHl6e2gtFipmrakrWBJkLeW8
  }

  const userId = main.id

  if(!userId) return null

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
      error: error instanceof Error ? error.message : "Failed to update cart item",
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
      error: error instanceof Error ? error.message : "Failed to remove from cart",
    };
  }
}




// export async function addAddress(data: AddressData) {
//   try {
//     const user = await currentUser();
    
//     if (!user) {
//       return {
//         success: false,
//         error: 'User not authenticated'
//       };
//     }

//     const userId = user.id;

//     console.log('USER:', userId);

//     // First try to find user with their address
//     const existingUser = await client.user.findUnique({
//       where: {
//         clerkId: userId
//       },
//       include: {
//         addresses: true
//       }
//     });

//     if (!existingUser) {
//       return {
//         success: false,
//         error: 'User not found'
//       };
//     }

//     let address;

//     const addressData = {
//       street: data.street || '',
//       city: data.city || '',
//       state: data.state || '',
//       postalCode: data.postalCode || '',
//       country: data.country || ''
//     };

//     if (existingUser.addresses) {
//       // Update existing address
//       address = await client.address.update({
//         where: {
//           userId: existingUser.id  // Using userId since it's unique in Address model
//         },
//         data: addressData
//       });
//     } else {
//       // Create new address
//       address = await client.address.create({
//         data: {
//           ...addressData,
//           userId: existingUser.id
//         }
//       });
//     }

//     return {
//       success: true,
//       data: address
//     };

//   } catch (error) {
//     console.error('Error updating address:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to update address'
//     };
//   }
// }

export async function addAddress(data: AddressData) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: 'User not authenticated',
    };
  }

  const userId = user.id;

  console.log('USER:', userId);
  console.log('Address:', data);

  try {
    const address = await client.address.create({
      data: {
        id: data.id || undefined, // Optional: if `data` contains an ID.
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: data.isDefault || false,
        userId: userId,
      },
    });

    return {
      success: true,
      address,
    };
  } catch (error) {
    console.error('Error creating address:', error);
    return {
      success: false,
      error: 'Failed to create address',
    };
  }
}
