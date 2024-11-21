"use server"

import { currentUser } from "@clerk/nextjs/server";
import { client } from "./prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

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