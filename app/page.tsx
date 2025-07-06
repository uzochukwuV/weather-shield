"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Shield, Zap, Users, ArrowRight, Leaf, Droplets, Wind } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectWallet } from "@/components/connect-wallet"

export default function LandingPage() {
  const { isConnected, address } = useWallet()
  const [stats, setStats] = useState({
    totalPolicies: 1247,
    totalCoverage: "2.4M",
    activeStations: 156,
    claimsPaid: "890K",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-800">WeatherShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-slate-800 transition-colors">
              How it Works
            </Link>
            <Link href="#stats" className="text-slate-600 hover:text-slate-800 transition-colors">
              Stats
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ConnectWallet />
            {isConnected && (
              <Button
                asChild
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
            Decentralized Weather Insurance
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Protect Your Crops with
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Smart Insurance
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Revolutionary blockchain-based weather insurance that automatically pays out when extreme weather conditions
            threaten your agricultural investments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8"
              >
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              <ConnectWallet size="lg" className="text-lg px-8" />
            )}
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-slate-300 hover:bg-slate-50 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose WeatherShield?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced technology meets agricultural protection with transparent, automated, and reliable coverage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Multi-Crop Coverage</CardTitle>
                <CardDescription className="text-slate-600">
                  Protect corn, wheat, rice, soybeans, cotton, vegetables, fruits, and more with tailored risk
                  assessments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Weather Risk Protection</CardTitle>
                <CardDescription className="text-slate-600">
                  Comprehensive coverage against drought, flood, and wind damage with real-time weather monitoring.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Instant Payouts</CardTitle>
                <CardDescription className="text-slate-600">
                  Automated claim processing and instant payouts when weather conditions trigger your policy.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Flexible Payments</CardTitle>
                <CardDescription className="text-slate-600">
                  Choose between one-time payments or convenient recurring installments in ETH or supported tokens.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Real-time Monitoring</CardTitle>
                <CardDescription className="text-slate-600">
                  Connected to weather stations worldwide for accurate, real-time weather risk assessment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-white/80">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-slate-800">Transparent & Trustless</CardTitle>
                <CardDescription className="text-slate-600">
                  Blockchain-based smart contracts ensure transparent, automated, and trustless insurance operations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Platform Statistics</h2>
            <p className="text-xl text-slate-600">
              Join thousands of farmers protecting their livelihoods with WeatherShield
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-blue-600">{stats.totalPolicies}</CardTitle>
                <CardDescription className="text-slate-600">Active Policies</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-green-600">${stats.totalCoverage}</CardTitle>
                <CardDescription className="text-slate-600">Total Coverage</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-purple-600">{stats.activeStations}</CardTitle>
                <CardDescription className="text-slate-600">Weather Stations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-orange-600">${stats.claimsPaid}</CardTitle>
                <CardDescription className="text-slate-600">Claims Paid</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Ready to Protect Your Crops?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Get started with WeatherShield today and secure your agricultural investments against unpredictable weather.
          </p>
          {isConnected ? (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8"
            >
              <Link href="/dashboard">
                Create Your First Policy <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          ) : (
            <ConnectWallet size="lg" className="text-lg px-8" />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-slate-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-800">WeatherShield</span>
            </div>
            <p className="text-slate-600">© 2024 WeatherShield. Protecting agriculture with blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
