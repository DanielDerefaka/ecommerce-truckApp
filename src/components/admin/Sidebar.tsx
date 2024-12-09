"use client"

import { 
  Bell, 
  ChevronDown, 
  Home, 
  LineChart, 
  LogOut, 
  Menu, 
  Settings, 
  ShoppingBag, 
  User2, 
  X,
  HelpCircle,
  BarChart3
} from 'lucide-react'
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigationItems = [
  { href: '/admin', icon: Home, label: 'Home' },
  { href: '/admin/analysis', icon: LineChart, label: 'Analysis' },
  { href: '/admin/add-product', icon: ShoppingBag, label: 'Add Product' },
  { href: '/admin/manage-users', icon: User2, label: 'Manage Users' },
  { href: '/admin/all-products', icon: BarChart3, label: 'All Products' }
]

const toolItems = [
  
]

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(false)
      }
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href
    
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
                ${isActive 
                  ? 'bg-gray-800 text-gray-100' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="flex items-center gap-4">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    )
  }

  const SidebarContent = () => (
    <div className={`flex h-full flex-col bg-black text-gray-100 transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center px-6 py-4 ${isCollapsed ? 'justify-center px-2' : 'gap-2'}`}>
        
        {!isCollapsed && <span className="text-xl font-bold">TruckX</span>}
      </div>
      
      <div className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>

      <div className="px-3 py-4">
        {!isCollapsed && (
          <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Tools
          </h2>
        )}
        <div className="space-y-1">
          {toolItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800 px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className={`w-full justify-start gap-2 bg-gray-800 text-left hover:bg-gray-700
                ${isCollapsed ? 'px-2' : ''}`} 
              variant="ghost"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage alt="User" src="/placeholder.svg" />
                <AvatarFallback>ZD</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>Zac</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              )}
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
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isMobile && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 right-[-20px] hidden rounded-full bg-gray-800 md:flex"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? 'Expand' : 'Collapse'} sidebar
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )

  return (
    <>
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-[300px] p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
      
      {!isMobile && <SidebarContent />}
    </>
  )
}

export default Sidebar