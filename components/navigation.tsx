"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Cloud, LayoutDashboard, MapPin, BarChart3, Menu, Plus } from "lucide-react"
import { ConnectWallet } from "./connect-wallet"
import { CreatePolicyDialog } from "./create-policy-dialog"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Stations", href: "/stations", icon: MapPin },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()
  const [showCreatePolicy, setShowCreatePolicy] = useState(false)

  return (
    <>
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-800">WeatherShield</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreatePolicy(true)}
              size="sm"
              className="hidden md:flex bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
            <ConnectWallet />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <Button
                    onClick={() => setShowCreatePolicy(true)}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Policy
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CreatePolicyDialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy} onPolicyCreated={() => {}} />
    </>
  )
}
