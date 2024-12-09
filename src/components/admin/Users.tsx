// manage-users-client.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Role } from "@prisma/client"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteUser, updateUserRole } from '@/lib/UserQueries'

// Types
type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  imageUrl?: string
}

interface Props {
  users: User[]
  searchParams: { search?: string }
}

// User Row Component
function UserRow({ user }: { user: User }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleRoleChange = async (newRole: Role) => {
    try {
      setIsUpdating(true)
      await updateUserRole(user.id, newRole)
      router.refresh()
      toast.success('User role updated successfully')
    } catch (error) {
      toast.error('Failed to update user role')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUser(user.id)
      router.refresh()
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Select
          defaultValue={user.role}
          onValueChange={handleRoleChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="mr-2"
              disabled={isDeleting || isUpdating}
            >
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            {/* Edit form would go here */}
          </DialogContent>
        </Dialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-700"
              disabled={isDeleting || isUpdating}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user and all their associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}

// Client Component
export default function ManageUsersClient({ users, searchParams }: Props) {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    
    const searchParams = new URLSearchParams()
    if (search) searchParams.set('search', search)
    
    router.push(`/admin/manage-users?${searchParams.toString()}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      
      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="max-w-sm">
          <Input 
            name="search"
            placeholder="Search users..." 
            defaultValue={searchParams.search}
          />
        </form>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            {/* Add user form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}