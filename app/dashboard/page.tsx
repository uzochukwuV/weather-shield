"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  Droplets,
  Wind,
  Plus,
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"
import { ConnectWallet } from "@/components/connect-wallet"
import { CreatePolicyDialog } from "@/components/create-policy-dialog"
import { formatEther } from "ethers"

interface Policy {
  id: string
  coverageType: string
  cropType: string
  coverageAmount: string
  totalPremium: string
  paidPremium: string
  status: string
  claimStatus: string
  startDate: string
  stationId: string
  deductible: string
}

interface RecurringPayment {
  id: string
  policyId: string
  installmentAmount: string
  totalInstallments: number
  paidInstallments: number
  nextPaymentDue: string
  isActive: boolean
}

export default function Dashboard() {
  const { isConnected, address } = useWallet()
  const { contract } = useContract()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePolicy, setShowCreatePolicy] = useState(false)

  const coverageTypeNames = {
    0: "Drought",
    1: "Flood",
    2: "Wind",
    3: "Multi-Peril",
  }

  const cropTypeNames = {
    0: "Corn",
    1: "Wheat",
    2: "Rice",
    3: "Soybean",
    4: "Cotton",
    5: "Vegetable",
    6: "Fruit",
    7: "Other",
  }

  const statusNames = {
    0: "Active",
    1: "Expired",
    2: "Claimed",
    3: "Cancelled",
  }

  const claimStatusNames = {
    0: "None",
    1: "Pending",
    2: "Approved",
    3: "Rejected",
    4: "Paid",
    5: "Pending Payout",
  }

  useEffect(() => {
    console.log(isConnected, contract, address)
    if (isConnected && contract && address) {
      loadUserData()
    }
  }, [isConnected, contract, address])

  const loadUserData = async () => {
    if (!contract || !address) return

    try {
      setLoading(true)

      // Get user policies
      const policyIds = await contract.getUserPolicies(address)
      console.log(policyIds)
      const policiesData = await Promise.all(
        policyIds.map(async (id: bigint) => {
          const policy = await contract.getPolicy(id)
          return {
            id: id.toString(),
            coverageType: coverageTypeNames[policy.coverageType as keyof typeof coverageTypeNames],
            cropType: cropTypeNames[policy.cropType as keyof typeof cropTypeNames],
            coverageAmount: formatEther(policy.coverageAmount),
            totalPremium: formatEther(policy.totalPremium),
            paidPremium: formatEther(policy.paidPremium),
            status: statusNames[policy.status as keyof typeof statusNames],
            claimStatus: claimStatusNames[policy.claimStatus as keyof typeof claimStatusNames],
            startDate: new Date(Number(policy.startDate) * 1000).toLocaleDateString(),
            stationId: policy.stationId,
            deductible: formatEther(policy.deductible),
          }
        }),
      )
      setPolicies(policiesData)

      // Get recurring payments
      const recurringIds = await contract.getUserRecurringPayments(address)
      const recurringData = await Promise.all(
        recurringIds.map(async (id: bigint) => {
          const payment = await contract.getRecurringPayment(id)
          return {
            id: id.toString(),
            policyId: payment.policyId.toString(),
            installmentAmount: formatEther(payment.installmentAmount),
            totalInstallments: Number(payment.totalInstallments),
            paidInstallments: Number(payment.paidInstallments),
            nextPaymentDue: new Date(Number(payment.nextPaymentDue) * 1000).toLocaleDateString(),
            isActive: payment.isActive,
          }
        }),
      )
      setRecurringPayments(recurringData)
      console.log("Loaded")
    } catch (error) {
      console.error("Error loading user data:", error)
      
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Expired: "secondary",
      Claimed: "default",
      Cancelled: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getClaimStatusBadge = (status: string) => {
    const variants = {
      None: "secondary",
      Pending: "default",
      Approved: "default",
      Rejected: "destructive",
      Paid: "default",
      "Pending Payout": "default",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getCoverageIcon = (type: string) => {
    switch (type) {
      case "Drought":
        return <Leaf className="w-4 h-4" />
      case "Flood":
        return <Droplets className="w-4 h-4" />
      case "Wind":
        return <Wind className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectWallet />
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalCoverage = policies.reduce((sum, policy) => sum + Number.parseFloat(policy.coverageAmount), 0)
  const totalPremiumPaid = policies.reduce((sum, policy) => sum + Number.parseFloat(policy.paidPremium), 0)
  const activePolicies = policies.filter((p) => p.status === "Active").length
  const pendingClaims = policies.filter((p) => p.claimStatus === "Pending" || p.claimStatus === "Approved").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
            <p className="text-slate-600">Manage your weather insurance policies</p>
          </div>
          <Button
            onClick={() => setShowCreatePolicy(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Policy
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Coverage</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{totalCoverage.toFixed(2)} ETH</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Premium Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{totalPremiumPaid.toFixed(4)} ETH</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Policies</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{activePolicies}</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Claims</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{pendingClaims}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 border border-slate-200">
            <TabsTrigger value="policies">My Policies</TabsTrigger>
            <TabsTrigger value="payments">Recurring Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 mt-2">Loading policies...</p>
              </div>
            ) : policies.length === 0 ? (
              <Card className="border-slate-200 bg-white/80">
                <CardContent className="text-center py-12">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Policies Yet</h3>
                  <p className="text-slate-600 mb-4">Create your first weather insurance policy to get started.</p>
                  <Button
                    onClick={() => setShowCreatePolicy(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Create Policy
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {policies.map((policy) => (
                  <Card key={policy.id} className="border-slate-200 bg-white/80 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                            {getCoverageIcon(policy.coverageType)}
                          </div>
                          <div>
                            <CardTitle className="text-slate-800">Policy #{policy.id}</CardTitle>
                            <CardDescription>
                              {policy.coverageType} • {policy.cropType} • Station: {policy.stationId}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(policy.status)}
                          {getClaimStatusBadge(policy.claimStatus)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-600">Coverage Amount</p>
                          <p className="font-semibold text-slate-800">
                            {Number.parseFloat(policy.coverageAmount).toFixed(2)} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Premium Paid</p>
                          <p className="font-semibold text-slate-800">
                            {Number.parseFloat(policy.paidPremium).toFixed(4)} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Start Date</p>
                          <p className="font-semibold text-slate-800">{policy.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Deductible</p>
                          <p className="font-semibold text-slate-800">
                            {Number.parseFloat(policy.deductible).toFixed(4)} ETH
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>Premium Progress</span>
                          <span>
                            {(
                              (Number.parseFloat(policy.paidPremium) / Number.parseFloat(policy.totalPremium)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(Number.parseFloat(policy.paidPremium) / Number.parseFloat(policy.totalPremium)) * 100}
                          className="h-2"
                        />
                      </div>

                      {policy.claimStatus === "Approved" && (
                        <div className="mt-4">
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                            Claim Payout
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-slate-600 mt-2">Loading payments...</p>
              </div>
            ) : recurringPayments.length === 0 ? (
              <Card className="border-slate-200 bg-white/80">
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Recurring Payments</h3>
                  <p className="text-slate-600">You don't have any recurring payment plans set up.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {recurringPayments.map((payment) => (
                  <Card key={payment.id} className="border-slate-200 bg-white/80">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-slate-800">Payment Plan #{payment.id}</CardTitle>
                          <CardDescription>Policy #{payment.policyId}</CardDescription>
                        </div>
                        <Badge variant={payment.isActive ? "default" : "secondary"}>
                          {payment.isActive ? "Active" : "Complete"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-600">Installment Amount</p>
                          <p className="font-semibold text-slate-800">
                            {Number.parseFloat(payment.installmentAmount).toFixed(4)} ETH
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Progress</p>
                          <p className="font-semibold text-slate-800">
                            {payment.paidInstallments}/{payment.totalInstallments}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Next Payment</p>
                          <p className="font-semibold text-slate-800">{payment.nextPaymentDue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Status</p>
                          <p className="font-semibold text-slate-800">{payment.isActive ? "Active" : "Complete"}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>Payment Progress</span>
                          <span>{((payment.paidInstallments / payment.totalInstallments) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress
                          value={(payment.paidInstallments / payment.totalInstallments) * 100}
                          className="h-2"
                        />
                      </div>

                      {payment.isActive && (
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Make Payment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreatePolicyDialog open={showCreatePolicy} onOpenChange={setShowCreatePolicy} onPolicyCreated={loadUserData} />
    </div>
  )
}
