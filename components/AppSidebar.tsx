"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Home, FileText, Palette, Settings, Crown, X } from "lucide-react"

export default function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <Sidebar className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 animate-slide-in">
      <SidebarHeader>
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-xl font-bold">ResumePro</h1>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <nav className="flex flex-col space-y-2 px-2">
            <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Home className="w-5 h-5" /> Dashboard
            </a>
            <a href="/resumes" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <FileText className="w-5 h-5" /> My Resumes
            </a>
            <a href="/templates" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Palette className="w-5 h-5" /> Templates
            </a>
            <a href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" /> Settings
            </a>
          </nav>
        </SidebarGroup>

        <SidebarGroup>
          <div className="mt-6 px-2">
            <a
              href="/upgrade"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600"
            >
              <Crown className="w-5 h-5" /> Upgrade to Pro
            </a>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-gray-500">
          © 2025 ResumePro
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
