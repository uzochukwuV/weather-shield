"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { ethers } from "ethers"

interface WalletContextType {
  isConnected: boolean
  network: string | null;
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  connect: () => Promise<void>
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined)



export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
   const [network, setNetwork] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)

  const context = useContext(WalletContext)
  if (!context) {
    // Return default values when used outside provider

    useEffect(() => {
      checkConnection()
    }, [])

    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {


          const provider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          const network = await provider.getNetwork()
          setNetwork(network.name)
          if (Number(network.chainId) != 84432){
           await connect2Base()
          }

          if (accounts.length > 0) {
            const signer = await provider.getSigner()
            setProvider(provider)
            setSigner(signer)
            setAddress(accounts[0].address)
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    const connect = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          await connect2Base();
          // Chain ID for Base Sepolia is 84432 (hex: 0x14A34)
          const baseSepoliaChainId = "0x14A34"

          // First, try switching to Base Sepolia
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: baseSepoliaChainId }],
          })
          await window.ethereum.request({ method: "eth_requestAccounts" })
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()

          setProvider(provider)
          setSigner(signer)
          setAddress(address)
          setIsConnected(true)
        } catch (error) {
          console.error("Error connecting wallet:", error)
        }

      } else {
        alert("Please install MetaMask!")
      }
    }

    const connect2Base = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // Chain ID for Base Sepolia is 84432 (hex: 0x14A34)
      const baseSepoliaChainId = "0x14A34"

      // First, try switching to Base Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: baseSepoliaChainId }],
      })
    } catch (switchError) {
      // If the chain is not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14A34",
                chainName: "Base Sepolia",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          })
        } catch (addError) {
          console.error("Failed to add Base Sepolia:", addError)
          return
        }
      } else {
        console.error("Failed to switch to Base Sepolia:", switchError)
        return
      }
    }

    // // Now request account access
    // try {
    //   await window.ethereum.request({ method: "eth_requestAccounts" })
    //   const provider = new ethers.BrowserProvider(window.ethereum)
    //   const signer = await provider.getSigner()
    //   const address = await signer.getAddress()

    //   setProvider(provider)
    //   setSigner(signer)
    //   setAddress(address)
    //   setIsConnected(true)
    // } catch (error) {
    //   console.error("Error connecting wallet:", error)
    // }
  } else {
    alert("Please install MetaMask!")
  }
}
    


    const disconnect = () => {
      setProvider(null)
      setSigner(null)
      setAddress(null)
      setIsConnected(false)
    }

    return {
      isConnected,
      address,
      provider,
      signer,
      connect,
      disconnect,
      network
    }
  }
  return context
}


