"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Activity, TrendingUp, Droplets, Wind, Sun, Search } from "lucide-react"
import { useContract } from "@/hooks/use-contract"

interface Station {
  id: string
  name: string
  location: string
  status: "active" | "inactive"
  riskFactors: {
    drought: number
    flood: number
    wind: number
  }
  activePolicies: number
  lastUpdate: string
}

export default function StationsPage() {
  const { contract } = useContract()
  const [stations, setStations] = useState<Station[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStations()
  }, [contract])

  const loadStations = async () => {
    // Mock data - replace with actual contract calls
    const mockStations: Station[] = [
      {
        id: "STATION_001",
        name: "Midwest Agricultural Hub",
        location: "Iowa, USA",
        status: "active",
        riskFactors: { drought: 85, flood: 45, wind: 60 },
        activePolicies: 23,
        lastUpdate: "2 hours ago",
      },
      {
        id: "STATION_002",
        name: "Great Plains Monitor",
        location: "Kansas, USA",
        status: "active",
        riskFactors: { drought: 92, flood: 30, wind: 75 },
        activePolicies: 18,
        lastUpdate: "1 hour ago",
      },
      {
        id: "STATION_003",
        name: "Pacific Coast Weather",
        location: "California, USA",
        status: "active",
        riskFactors: { drought: 78, flood: 65, wind: 40 },
        activePolicies: 31,
        lastUpdate: "30 minutes ago",
      },
      {
        id: "STATION_004",
        name: "Southeast Agricultural",
        location: "Georgia, USA",
        status: "active",
        riskFactors: { drought: 55, flood: 80, wind: 85 },
        activePolicies: 27,
        lastUpdate: "45 minutes ago",
      },
      {
        id: "STATION_005",
        name: "Northern Plains Hub",
        location: "North Dakota, USA",
        status: "inactive",
        riskFactors: { drought: 70, flood: 35, wind: 55 },
        activePolicies: 0,
        lastUpdate: "2 days ago",
      },
    ]

    setStations(mockStations)
    setLoading(false)
  }

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return { level: "High", color: "bg-red-500" }
    if (risk >= 60) return { level: "Medium", color: "bg-yellow-500" }
    return { level: "Low", color: "bg-green-500" }
  }

  const getRiskBadge = (risk: number) => {
    const { level, color } = getRiskLevel(risk)
    return (
      <Badge variant="secondary" className="text-xs">
        <div className={`w-2 h-2 rounded-full ${color} mr-1`} />
        {level}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Weather Stations</h1>
          <p className="text-slate-600">Monitor weather conditions and risk factors across our network</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Stations</CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stations.length}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Stations</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {stations.filter((s) => s.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Policies</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {stations.reduce((sum, s) => sum + s.activePolicies, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Risk Level</CardTitle>
              <Sun className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Medium</div>
            </CardContent>
          </Card>
        </div>

        {/* Stations Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading stations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station) => (
              <Card key={station.id} className="border-slate-200 bg-white/80 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-slate-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {station.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">{station.location}</CardDescription>
                    </div>
                    <Badge variant={station.status === "active" ? "default" : "secondary"}>{station.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Risk Factors</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-3 h-3 text-orange-500" />
                          <span className="text-sm text-slate-600">Drought</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{station.riskFactors.drought}%</span>
                          {getRiskBadge(station.riskFactors.drought)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span className="text-sm text-slate-600">Flood</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{station.riskFactors.flood}%</span>
                          {getRiskBadge(station.riskFactors.flood)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wind className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-slate-600">Wind</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{station.riskFactors.wind}%</span>
                          {getRiskBadge(station.riskFactors.wind)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-600">Active Policies</p>
                      <p className="font-semibold text-slate-800">{station.activePolicies}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-600">Last Update</p>
                      <p className="font-semibold text-slate-800">{station.lastUpdate}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    disabled={station.status === "inactive"}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStations.length === 0 && !loading && (
          <Card className="border-slate-200 bg-white/80">
            <CardContent className="text-center py-12">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Stations Found</h3>
              <p className="text-slate-600">Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
