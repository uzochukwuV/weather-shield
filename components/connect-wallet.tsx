"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet } from "lucide-react"

interface ConnectWalletProps {
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ConnectWallet({ size = "default", className }: ConnectWalletProps) {
  const { isConnected, address, network, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
     <div>
       <Button variant="outline" size={size} onClick={disconnect} className={className}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
      <p className=" text-sm  text-slate-400 text-center">{network}</p>
     </div>
    )
  }

  return (
    <Button
      onClick={connect}
      size={size}
      className={`bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 ${className}`}
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
