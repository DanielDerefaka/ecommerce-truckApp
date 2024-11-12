"use server"

import { PrismaClient, Prisma, Role, OrderStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Types
type CreateUserInput = {
  email: string
  password: string
  name?: string
  phone?: string
  role?: Role
}

type CreateProductInput = {
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  specifications: Record<string, any>
  categoryId: string
}

type CreateOrderInput = {
  userId: string
  items: {
    productId: string
    quantity: number
  }[]
}

// User Queries
export const userQueries = {
  // Create a new user
  async createUser(data: CreateUserInput) {
    const hashedPassword = await hash(data.password, 12)
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        cart: { create: {} },      // Create empty cart
        wishlist: { create: {} },  // Create empty wishlist
      },
      include: {
        cart: true,
        wishlist: true,
      },
    })
  },

  // Get user by email (for authentication)
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        wishlist: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })
  },

  // Update user profile
  async updateUser(userId: string, data: Partial<CreateUserInput>) {
    if (data.password) {
      data.password = await hash(data.password, 12)
    }
    return prisma.user.update({
      where: { id: userId },
      data,
    })
  },

  // Add address to user
  async addUserAddress(userId: string, addressData: Prisma.AddressCreateInput) {
    return prisma.address.create({
      data: {
        ...addressData,
        user: { connect: { id: userId } },
      },
    })
  },
}

// Product Queries
export const productQueries = {
  // Create new product (admin only)
  async createProduct(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
      },
      include: {
        category: true,
      },
    })
  },

  // Get all products with filtering
  async getProducts(params: {
    skip?: number
    take?: number
    categoryId?: string
    searchQuery?: string
    minPrice?: number
    maxPrice?: number
  }) {
    const { skip = 0, take = 10, categoryId, searchQuery, minPrice, maxPrice } = params

    const where: Prisma.ProductWhereInput = {
      AND: [
        categoryId ? { categoryId } : {},
        searchQuery ? {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
          ],
        } : {},
        minPrice ? { price: { gte: new Prisma.Decimal(minPrice) } } : {},
        maxPrice ? { price: { lte: new Prisma.Decimal(maxPrice) } } : {},
      ],
    }

    const [items, count] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return { items, count }
  },

  // Update product (admin only)
  async updateProduct(productId: string, data: Partial<CreateProductInput>) {
    if (data.price) {
      data.price = Number(new Prisma.Decimal(data.price))
    }
    return prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true,
      },
    })
  },

  // Delete product (admin only)
  async deleteProduct(productId: string) {
    return prisma.product.delete({
      where: { id: productId },
    })
  },
}

// Cart Queries
export const cartQueries = {
  // Add item to cart
  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    if (!cart) throw new Error('Cart not found')

    const existingItem = cart.items.find(item => item.productId === productId)

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      })
    }

    return prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: productId } },
        quantity,
      },
      include: { product: true },
    })
  },

  // Remove item from cart
  async removeFromCart(userId: string, cartItemId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    if (!cart) throw new Error('Cart not found')

    return prisma.cartItem.delete({
      where: { id: cartItemId },
    })
  },

  // Update cart item quantity
  async updateCartItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    })

    if (!cart) throw new Error('Cart not found')

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    })
  },
}

// Wishlist Queries
export const wishlistQueries = {
  // Add to wishlist
  async addToWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    })

    if (!wishlist) throw new Error('Wishlist not found')

    return prisma.wishlistItem.create({
      data: {
        wishlist: { connect: { id: wishlist.id } },
        product: { connect: { id: productId } },
      },
      include: { product: true },
    })
  },

  // Remove from wishlist
  async removeFromWishlist(userId: string, wishlistItemId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    })

    if (!wishlist) throw new Error('Wishlist not found')

    return prisma.wishlistItem.delete({
      where: { id: wishlistItemId },
    })
  },
}

// Order Queries
export const orderQueries = {
  // Create order
  async createOrder(data: CreateOrderInput) {
    const orderItems = await Promise.all(
      data.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })
        if (!product) throw new Error(`Product ${item.productId} not found`)
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`)
        }
        return {
          quantity: item.quantity,
          price: product.price,
          product: { connect: { id: item.productId } },
        }
      })
    )

    const totalAmount = orderItems.reduce(
      (sum, item) => sum.plus(item.price.times(item.quantity)),
      new Prisma.Decimal(0)
    )

    return prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          user: { connect: { id: data.userId } },
          orderNumber: `ORD-${Date.now()}`,
          totalAmount,
          items: {
            create: orderItems,
          },
          tracking: {
            create: {
              currentLocation: { lat: 0, lng: 0 },
              status: 'PENDING',
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          tracking: true,
        },
      })

      // Update product stock
      await Promise.all(
        data.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      )

      // Clear cart
      await tx.cart.update({
        where: { userId: data.userId },
        data: {
          items: {
            deleteMany: {},
          },
        },
      })

      return order
    })
  },

  // Get user orders
  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tracking: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        tracking: true,
      },
    })
  },
}

// Tracking Queries
export const trackingQueries = {
  // Update tracking information
  async updateTracking(orderId: string, location: { lat: number; lng: number }, status: string) {
    return prisma.tracking.update({
      where: { orderId },
      data: {
        currentLocation: location,
        status,
      },
    })
  },

  // Get tracking information
  async getTracking(orderId: string) {
    return prisma.tracking.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })
  },
}

// Review Queries
export const reviewQueries = {
  // Create review
  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    return prisma.review.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  },

  // Get product reviews
  async getProductReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}

export default {
  user: userQueries,
  product: productQueries,
  cart: cartQueries,
  wishlist: wishlistQueries,
  order: orderQueries,
  tracking: trackingQueries,
  review: reviewQueries,
}