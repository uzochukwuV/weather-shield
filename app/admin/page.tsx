"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"

export default function AdminDashboard() {
  const { isConnected, address } = useWallet()
  const { contract } = useContract()

  // State for supported tokens
  const [tokenAddress, setTokenAddress] = useState("")
  const [tokens, setTokens] = useState<string[]>([])
  const [addTokenLoading, setAddTokenLoading] = useState(false)

  // State for stations
  const [stationId, setStationId] = useState("")
  const [stationName, setStationName] = useState("")
  const [stations, setStations] = useState<{ id: string; name: string }[]>([])
  const [addStationLoading, setAddStationLoading] = useState(false)

  // State for withdraw
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  // Load tokens and stations on mount
  useEffect(() => {
    if (isConnected && contract) {
      loadTokens()
      loadStations()
    }
  }, [isConnected, contract])

  const loadTokens = async () => {
    try {
      if (!contract) return
      const tokenList = await contract.getSupportedTokens()
      setTokens(tokenList)
    } catch (e) {
      setTokens([])
    }
  }

  const loadStations = async () => {
    try {
      if (!contract) return
      const stationList = await contract.getStations()
      setStations(stationList.map((s: any) => ({ id: s.id.toString(), name: s.name })))
    } catch (e) {
      setStations([])
    }
  }

  const handleAddToken = async () => {
    if(!contract){
        return
    }
    if (!tokenAddress) return
    setAddTokenLoading(true)
    try {
      await contract.addSupportedToken(tokenAddress)
      setTokenAddress("")
      loadTokens()
    } catch (e) {
      // handle error
    }
    setAddTokenLoading(false)
  }

  const handleAddStation = async () => {
    if(!contract){
        return
    }
    if (!stationId || !stationName) return
    setAddStationLoading(true)
    try {
      await contract.addStation(stationId, stationName)
      setStationId("")
      setStationName("")
      loadStations()
    } catch (e) {
      // handle error
    }
    setAddStationLoading(false)
  }

  const handleWithdraw = async () => {
    if(!contract){
        return
    }
    if (!withdrawAmount) return
    setWithdrawLoading(true)
    try {
      await contract.withdrawEmergencyFunds(withdrawAmount)
      setWithdrawAmount("")
    } catch (e) {
      // handle error
    }
    setWithdrawLoading(false)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Please connect your wallet</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10">
      <div className="container mx-auto max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Supported Tokens</CardTitle>
            <CardDescription>Add a new supported token address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Token Address"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
              />
              <Button onClick={handleAddToken} disabled={addTokenLoading}>
                {addTokenLoading ? "Adding..." : "Add Token"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tokens.map(token => (
                <Badge key={token}>{token}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stations</CardTitle>
            <CardDescription>Add a new weather station</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Station ID"
                value={stationId}
                onChange={e => setStationId(e.target.value)}
              />
              <Input
                placeholder="Station Name"
                value={stationName}
                onChange={e => setStationName(e.target.value)}
              />
              <Button onClick={handleAddStation} disabled={addStationLoading}>
                {addStationLoading ? "Adding..." : "Add Station"}
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {stations.map(station => (
                <div key={station.id} className="flex gap-2 items-center">
                  <Badge>{station.id}</Badge>
                  <span>{station.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Emergency Funds</CardTitle>
            <CardDescription>Withdraw funds from the contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Amount (ETH)"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
              />
              <Button onClick={handleWithdraw} disabled={withdrawLoading}>
                {withdrawLoading ? "Withdrawing..." : "Withdraw"}
              </Button>
            </div>    
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
