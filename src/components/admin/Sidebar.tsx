"use client"

import { Bell, ChevronDown, Home, LineChart, LogOut, Menu, MessageCircle, Search, Settings, ShoppingBag, User2, X } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const SidebarContent = () => (
    <div className="flex h-full w-64 flex-col bg-black text-gray-100">
      <div className="flex items-center gap-2 px-6 py-4">
        <div className="rounded-full bg-blue-500 p-1">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-xl font-bold">Xenith</span>
      </div>
      <div className="flex-1 space-y-1 px-3 py-4">
        <Link
          className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-gray-100 transition-colors hover:bg-gray-700"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100" 
          href="/analysis"
          onClick={() => setIsOpen(false)}
        >
          <LineChart className="h-5 w-5" />
          Analysis
        </Link>
        <Link 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100" 
          href="/add-product"
          onClick={() => setIsOpen(false)}
        >
          <ShoppingBag className="h-5 w-5" />
          Add Product
        </Link>
        <Link 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100" 
          href="/manage-users"
          onClick={() => setIsOpen(false)}
        >
          <User2 className="h-5 w-5" />
          Manage Users
        </Link>
      </div>
      <div className="px-3 py-4">
        <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Tools</h2>
        <div className="space-y-1">
          <Link 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-100" 
            href="#"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-800 px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start gap-2 bg-gray-800 text-left hover:bg-gray-700" variant="ghost">
              <Avatar className="h-8 w-8">
                <AvatarImage alt="User" src="/placeholder.svg" />
                <AvatarFallback>ZD</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center justify-between">
                <span>Zac</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <SidebarContent />
      )}
    </>
  )
}