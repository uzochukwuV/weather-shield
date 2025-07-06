"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useContract } from "@/hooks/use-contract"
import { parseEther } from "ethers"
import { Leaf, Droplets, Wind, Shield, Calendar, DollarSign } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { sign } from "crypto"

interface CreatePolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPolicyCreated: () => void
}

export function CreatePolicyDialog({ open, onOpenChange, onPolicyCreated }: CreatePolicyDialogProps) {
  const { contract } = useContract()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const {signer} = useWallet()
  const [formData, setFormData] = useState({
    stationId: "",
    coverageType: "",
    cropType: "",
    duration: "",
    coverageAmount: "",
    deductible: "",
    paymentType: "oneTime", // oneTime or recurring
    installments: "3",
  })
  const [premiumQuote, setPremiumQuote] = useState<string>("")

  const coverageTypes = [
    { value: "0", label: "Drought", icon: Leaf, description: "Protection against drought conditions" },
    { value: "1", label: "Flood", icon: Droplets, description: "Protection against flood damage" },
    { value: "2", label: "Wind", icon: Wind, description: "Protection against wind damage" },
    { value: "3", label: "Multi-Peril", icon: Shield, description: "Comprehensive weather protection" },
  ]

  const cropTypes = [
    { value: "0", label: "Corn" },
    { value: "1", label: "Wheat" },
    { value: "2", label: "Rice" },
    { value: "3", label: "Soybean" },
    { value: "4", label: "Cotton" },
    { value: "5", label: "Vegetable" },
    { value: "6", label: "Fruit" },
    { value: "7", label: "Other" },
  ]

  const durations = [
    { value: "0", label: "3 Months" },
    { value: "1", label: "6 Months" },
    { value: "2", label: "12 Months" },
  ]


  const stations = ["883650f0-5343-11ef-a2e4-6df465256924", "883650f0-5343-11ef-a2e4-6df46256924", "883650f0-5343-11ef-a2e4-6df46525692", "STATION_004", "STATION_005"]

  const calculatePremium = async () => {
    if (
      !contract ||
      !formData.coverageAmount ||
      !formData.coverageType ||
      !formData.cropType ||
      !formData.duration ||
      !formData.stationId
    ) {
      return
    }
    const netork = await signer?.provider.getNetwork()
    console.log(netork)
    try {
      const coverageAmountWei = parseEther(formData.coverageAmount)
      const deductibleWei = formData.deductible ? parseEther(formData.deductible) : 0

      console.log(coverageAmountWei,  Number.parseInt(formData.coverageType),
        Number.parseInt(formData.cropType),
        Number.parseInt(formData.duration),
        formData.stationId,
        deductibleWei,)

      const [premium] = await contract.calculatePremium(
        coverageAmountWei,
        Number.parseInt(formData.coverageType),
        Number.parseInt(formData.cropType),
        Number.parseInt(formData.duration),
        formData.stationId,
        deductibleWei,
      )
      
      setPremiumQuote(premium.toString())
    } catch (error) {
      console.error("Error calculating premium:", error)
    }
  }

  const createPolicy = async () => {
    if (!contract) return
    const netork = await signer?.provider.getNetwork()
    console.log(netork)

    try {
      setLoading(true)

      const coverageAmountWei = parseEther(formData.coverageAmount)
      const deductibleWei = formData.deductible ? parseEther(formData.deductible) : 0
      console.log(
         formData.stationId,
          Number.parseInt(formData.coverageType),
          Number.parseInt(formData.cropType),
          Number.parseInt(formData.duration),
          coverageAmountWei,
          deductibleWei,
      )
      if (formData.paymentType === "oneTime") {
        const tx = await contract.createPolicyOneTime(
          formData.stationId,
          Number.parseInt(formData.coverageType),
          Number.parseInt(formData.cropType),
          Number.parseInt(formData.duration),
          coverageAmountWei,
          deductibleWei,
          { value: premiumQuote },
        )
        await tx.wait()
      } else {
        const tx = await contract.createPolicyRecurring(
          formData.stationId,
          Number.parseInt(formData.coverageType),
          Number.parseInt(formData.cropType),
          Number.parseInt(formData.duration),
          coverageAmountWei,
          deductibleWei,
          Number.parseInt(formData.installments),
          { value: parseEther((Number.parseFloat(premiumQuote) / Number.parseInt(formData.installments)).toString()) },
        )
        await tx.wait()
      }

      onPolicyCreated()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error creating policy:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      stationId: "",
      coverageType: "",
      cropType: "",
      duration: "",
      coverageAmount: "",
      deductible: "",
      paymentType: "oneTime",
      installments: "3",
    })
    setPremiumQuote("")
  }

  const nextStep = () => {
    if (step === 2) {
      calculatePremium()
    }
    setStep(step + 1)
  }

  const getCoverageIcon = (type: string) => {
    const coverage = coverageTypes.find((c) => c.value === type)
    if (!coverage) return Shield
    return coverage.icon
  }

  // const testPremium =async ()=>{
  //   const [premium] = await contract!.calculatePremium(
  //       10000,
  //       Number.parseInt(formData.coverageType),
  //       Number.parseInt(formData.cropType),
  //       Number.parseInt(formData.duration),
  //       formData.stationId,
  //       10,
  //     )
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Weather Insurance Policy</DialogTitle>
          <DialogDescription>
            Protect your crops against weather risks with our comprehensive insurance coverage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {i}
                </div>
                {i < 3 && <div className={`w-12 h-0.5 ${i < step ? "bg-blue-500" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stationId">Weather Station</Label>
                  <Select
                    value={formData.stationId}
                    onValueChange={(value) => setFormData({ ...formData, stationId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station} value={station}>
                          {station}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Coverage Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {coverageTypes.map((coverage) => {
                    const Icon = coverage.icon
                    return (
                      <Card
                        key={coverage.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.coverageType === coverage.value ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => setFormData({ ...formData, coverageType: coverage.value })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{coverage.label}</p>
                              <p className="text-xs text-slate-600">{coverage.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Policy Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Coverage Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coverageAmount">Coverage Amount (ETH)</Label>
                  <Input
                    id="coverageAmount"
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="10"
                    placeholder="0.5"
                    value={formData.coverageAmount}
                    onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                  />
                  <p className="text-xs text-slate-600">Min: 0.1 ETH, Max: 10 ETH</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deductible">Deductible (ETH)</Label>
                  <Input
                    id="deductible"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.05"
                    value={formData.deductible}
                    onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                  />
                  <p className="text-xs text-slate-600">Higher deductible = Lower premium</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Tabs
                  value={formData.paymentType}
                  onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="oneTime">One-time Payment</TabsTrigger>
                    <TabsTrigger value="recurring">Recurring Payments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="oneTime" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">Pay full premium upfront</p>
                            <p className="text-sm text-slate-600">Single payment, immediate coverage</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recurring" className="mt-4">
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Split premium into installments</p>
                            <p className="text-sm text-slate-600">Pay over time with flexible terms</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="installments">Number of Installments</Label>
                          <Select
                            value={formData.installments}
                            onValueChange={(value) => setFormData({ ...formData, installments: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Installments</SelectItem>
                              <SelectItem value="6">6 Installments</SelectItem>
                              <SelectItem value="12">12 Installments</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      {React.createElement(getCoverageIcon(formData.coverageType), {
                        className: "w-4 h-4 text-blue-600",
                      })}
                    </div>
                    Policy Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Coverage Type</p>
                      <p className="font-medium">
                        {coverageTypes.find((c) => c.value === formData.coverageType)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Crop Type</p>
                      <p className="font-medium">{cropTypes.find((c) => c.value === formData.cropType)?.label}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Duration</p>
                      <p className="font-medium">{durations.find((d) => d.value === formData.duration)?.label}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Weather Station</p>
                      <p className="font-medium">{formData.stationId}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Coverage Amount</p>
                      <p className="font-medium">{formData.coverageAmount} ETH</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Deductible</p>
                      <p className="font-medium">{formData.deductible || "0"} ETH</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {premiumQuote && (
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Quote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Total Premium</span>
                        <span className="font-bold text-lg">
                          {(Number.parseFloat(premiumQuote) / 1e18).toFixed(6)} ETH
                          -
                          {(Number.parseFloat(premiumQuote) * 3000 / 1e18).toFixed(6)} USD
                        </span>
                      </div>

                      {formData.paymentType === "recurring" && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Per Installment</span>
                          <span className="font-medium">
                            {(Number.parseFloat(premiumQuote) / 1e18 / Number.parseInt(formData.installments)).toFixed(
                              6,
                            )}{" "}
                            ETH
                          </span>
                        </div>
                      )}

                      <Badge variant="secondary" className="w-full justify-center">
                        {formData.paymentType === "oneTime"
                          ? "One-time Payment"
                          : `${formData.installments} Installments`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : onOpenChange(false))}>
              {step > 1 ? "Previous" : "Cancel"}
            </Button>

            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (step === 1 &&
                    (!formData.stationId || !formData.coverageType || !formData.cropType || !formData.duration)) ||
                  (step === 2 && !formData.coverageAmount)
                }
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={createPolicy}
                disabled={loading || !premiumQuote}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {loading ? "Creating..." : "Create Policy"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
