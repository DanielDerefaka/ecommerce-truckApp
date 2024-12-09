// actions.ts
'use server'

import { client } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
  try {
    // Begin transaction
    await client.$transaction(async (tx) => {
      // Delete related records first
      await tx.cart.deleteMany({ where: { userId } })
      await tx.address.deleteMany({ where: { userId } })
      await tx.order.deleteMany({ where: { userId } })
      
      // Delete the user
      await tx.user.delete({ where: { id: userId } })
    })

    revalidatePath('/admin/manage-users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('Failed to delete user')
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    await client.user.update({
      where: { id: userId },
      data: { role }
    })
    
    revalidatePath('/admin/manage-users')
    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error('Failed to update user role')
  }
}

// This function would be called from your page.tsx to fetch users
export async function getUsers(search?: string) {
  try {
    return await client.user.findMany({
      where: search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        imageUrl: true
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}