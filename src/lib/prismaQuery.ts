"use server"

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { type User, Role } from "@prisma/client";

const ProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0.01, "Price must be greater than 0"),
    stock: z.number().min(0, "Stock cannot be negative"),
    images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
    categoryId: z.string().min(1, "Category is required"),
    location: z.string().min(1, "Category is required"),
    miles: z.string().min(1, "Category is required"),
});

type CreateProductInput = z.infer<typeof ProductSchema>;

export async function createProduct(input: CreateProductInput) {
    try {
        // Validate the input first
        const validatedInput = ProductSchema.parse(input);

        // Check for authenticated user
        const user = await currentUser();
        if (!user) {
            throw new Error("Unauthorized: Please sign in to create products");
        }

        // First check if the category exists
        const existingCategory = await client.category.findUnique({
            where: {
                name: validatedInput.categoryId
            }
        });

        if (!existingCategory) {
            throw new Error("Category not found");
        }

        // Create the product
        const product = await client.product.create({
            data: {
                name: validatedInput.name,
                description: validatedInput.description,
                price: validatedInput.price,
                stock: validatedInput.stock,
                categoryId: validatedInput.categoryId,
                miles:validatedInput.miles,
                loction: validatedInput.location,
                images: {
                    create: validatedInput.images.map(url => ({ url }))
                }
            },
            include: {
                images: true,
            }
        });

        return {
            success: true,
            data: product
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle Prisma-specific errors
            if (error.code === 'P2002') {
                throw new Error('A product with this name already exists');
            }
            if (error.code === 'P2003') {
                throw new Error('Referenced category does not exist');
            }
        }

        console.error("Error creating product:", error);
        throw error instanceof Error 
            ? error 
            : new Error("Failed to create product");
    }
}






// Response type for user operations
interface UserResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Type for user data with role
interface UserWithRole extends User {
  role: Role;
}

/**
 * Get all users with their roles
 */
export async function getAllUsers(): Promise<UserResponse> {
  try {
    const users = await client.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      data: users
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users"
    };
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<UserResponse> {
  try {
    // First check if the user exists
    const existingUser = await client.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return {
        success: false,
        error: "User not found"
      };
    }

    // Delete related records first
    // Delete user's cart
    await client.cart.deleteMany({
      where: { userId: userId }
    });

    // Delete user's addresses
    await client.address.deleteMany({
      where: { userId: userId }
    });

    // Delete user's orders
    await client.order.deleteMany({
      where: { userId: userId }
    });

    // Finally delete the user
    const deletedUser = await client.user.delete({
      where: { id: userId }
    });

    return {
      success: true,
      data: deletedUser
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user"
    };
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(searchTerm: string): Promise<UserResponse> {
  try {
    const users = await client.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            lastName: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        imageUrl: true
      }
    });

    return {
      success: true,
      data: users
    };
  } catch (error) {
    console.error("Error searching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search users"
    };
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: Role): Promise<UserResponse> {
  try {
    const updatedUser = await client.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    return {
      success: true,
      data: updatedUser
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user role"
    };
  }
}