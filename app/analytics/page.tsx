"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Shield, AlertTriangle, Users, Activity } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock data - replace with actual contract data
  const policyData = [
    { month: "Jan", policies: 45, claims: 8, premiums: 12.5 },
    { month: "Feb", policies: 52, claims: 12, premiums: 15.2 },
    { month: "Mar", policies: 48, claims: 15, premiums: 14.1 },
    { month: "Apr", policies: 61, claims: 9, premiums: 18.3 },
    { month: "May", policies: 55, claims: 18, premiums: 16.7 },
    { month: "Jun", policies: 67, claims: 22, premiums: 20.1 },
  ]

  const coverageTypeData = [
    { name: "Drought", value: 35, color: "#f59e0b" },
    { name: "Flood", value: 28, color: "#3b82f6" },
    { name: "Wind", value: 22, color: "#6b7280" },
    { name: "Multi-Peril", value: 15, color: "#8b5cf6" },
  ]

  const riskTrendData = [
    { date: "Week 1", drought: 65, flood: 45, wind: 55 },
    { date: "Week 2", drought: 70, flood: 52, wind: 48 },
    { date: "Week 3", drought: 68, flood: 48, wind: 62 },
    { date: "Week 4", drought: 75, flood: 55, wind: 58 },
  ]

  const stats = {
    totalPolicies: 1247,
    totalPremiums: 89.4,
    totalClaims: 156,
    claimsPaid: 45.2,
    activeUsers: 892,
    avgPolicyValue: 2.1,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive insights into platform performance and risk metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Policies</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.totalPolicies.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Premiums</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.totalPremiums} ETH</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Claims</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.totalClaims}</div>
              <p className="text-xs text-red-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Claims Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.claimsPaid} ETH</div>
              <p className="text-xs text-slate-600">
                {((stats.claimsPaid / stats.totalPremiums) * 100).toFixed(1)}% of premiums
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.activeUsers}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg Policy</CardTitle>
              <Activity className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats.avgPolicyValue} ETH</div>
              <p className="text-xs text-slate-600">Average coverage amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 border border-slate-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-slate-200 bg-white/80">
                <CardHeader>
                  <CardTitle>Policy Growth</CardTitle>
                  <CardDescription>Monthly policy creation and premium collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={policyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="policies" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/80">
                <CardHeader>
                  <CardTitle>Coverage Distribution</CardTitle>
                  <CardDescription>Breakdown by coverage type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={coverageTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {coverageTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {coverageTypeData.map((item) => (
                      <Badge key={item.name} variant="secondary" className="text-xs">
                        <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                        {item.name} ({item.value}%)
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card className="border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle>Premium Collection Trends</CardTitle>
                <CardDescription>Monthly premium collection in ETH</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={policyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="premiums"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims" className="space-y-6">
            <Card className="border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle>Claims Analysis</CardTitle>
                <CardDescription>Monthly claims filed and processed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={policyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="claims" fill="#f59e0b" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="border-slate-200 bg-white/80">
              <CardHeader>
                <CardTitle>Weather Risk Trends</CardTitle>
                <CardDescription>Weekly risk factor analysis across all stations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="drought" stroke="#f59e0b" strokeWidth={2} name="Drought Risk" />
                    <Line type="monotone" dataKey="flood" stroke="#3b82f6" strokeWidth={2} name="Flood Risk" />
                    <Line type="monotone" dataKey="wind" stroke="#6b7280" strokeWidth={2} name="Wind Risk" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
