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