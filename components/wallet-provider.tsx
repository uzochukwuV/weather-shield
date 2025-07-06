"use client"
import { useWallet, WalletContext } from "@/hooks/use-wallet"


export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet()
  return <WalletContext.Provider value={wallet} >
    {children}
  </WalletContext.Provider>
}