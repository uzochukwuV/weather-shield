"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useWallet } from "./use-wallet"

// Contract ABI (simplified - you'll need to add the full ABI)
const CONTRACT_ABI =  [
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_checkInterval",
					"type": "uint256"
				},
				{
					"internalType": "uint64",
					"name": "_subscriptionId",
					"type": "uint64"
				},
				{
					"internalType": "string",
					"name": "key",
					"type": "string"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "EmptyArgs",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "EmptySource",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "NoInlineSecrets",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "OnlyRouterCanFulfill",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "OwnableInvalidOwner",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "OwnableUnauthorizedAccount",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "ReentrancyGuardReentrantCall",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InsufficientBalance",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InsufficientPremium",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InvalidCoverageAmount",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InvalidInstallmentCount",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InvalidStationId",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__InvalidTokenAmount",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__NoPendingPayout",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__NotPolicyHolder",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__PaymentNotDue",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__PayoutFailed",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__PolicyNotActive",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__PolicyNotFound",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__PriceFeedError",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__RecurringPaymentComplete",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__RecurringPaymentNotFound",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__StationAlreadyExists",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__TokenTransferFailed",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__UnauthorizedClaim",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "requestId",
					"type": "bytes32"
				}
			],
			"name": "WeatherInsurance__UnexpectedRequestID",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "WeatherInsurance__UnsupportedPaymentToken",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "timestamp",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "policiesChecked",
					"type": "uint256"
				}
			],
			"name": "AutomationPerformed",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "payoutAmount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "enum WeatherInsurance.ClaimStatus",
					"name": "status",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "reason",
					"type": "string"
				}
			],
			"name": "ClaimProcessed",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "token",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "priceFeed",
					"type": "address"
				}
			],
			"name": "PaymentTokenAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "token",
					"type": "address"
				}
			],
			"name": "PaymentTokenRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "PayoutClaimed",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "coverageType",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "enum WeatherInsurance.CropType",
					"name": "cropType",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "coverageAmount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "totalPremium",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "address",
					"name": "paymentToken",
					"type": "address"
				}
			],
			"name": "PolicyCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "totalPremiumPaid",
					"type": "uint256"
				}
			],
			"name": "PolicyFullyPaid",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "recurringId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "installmentAmount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "totalInstallments",
					"type": "uint256"
				}
			],
			"name": "RecurringPaymentCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "recurringId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "installmentNumber",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "RecurringPaymentMade",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "id",
					"type": "bytes32"
				}
			],
			"name": "RequestFulfilled",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "id",
					"type": "bytes32"
				}
			],
			"name": "RequestSent",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				},
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "droughtMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "floodMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "windMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "bool",
							"name": "isSet",
							"type": "bool"
						}
					],
					"indexed": false,
					"internalType": "struct WeatherInsurance.RegionRisk",
					"name": "regionRisk",
					"type": "tuple"
				}
			],
			"name": "StationAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "requestId",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				}
			],
			"name": "WeatherDataRequestSent",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "timestamp",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "droughtRisk",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "floodRisk",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "windRisk",
					"type": "uint8"
				}
			],
			"name": "WeatherRiskDataReceived",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "ADMIN_FEE_RATE",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "BASE_RISK_RATE_MAX",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "BASE_RISK_RATE_MIN",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "BASIS_POINTS",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "DROUGHT_RISK_THRESHOLD",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "FLOOD_RISK_THRESHOLD",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "LOADING_FACTOR_MAX",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "LOADING_FACTOR_MIN",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "MAX_COVERAGE",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "MAX_DEDUCTIBLE_DISCOUNT",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "MIN_COVERAGE",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "POLICY_DURATION_12M",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "POLICY_DURATION_3M",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "POLICY_DURATION_6M",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "WEATHER_SOURCE",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "WIND_RISK_THRESHOLD",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"name": "activeStations",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_droughtMultiplier",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_floodMultiplier",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_windMultiplier",
					"type": "uint256"
				}
			],
			"name": "addStation",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_priceFeedAddress",
					"type": "address"
				}
			],
			"name": "addSupportedPaymentToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				}
			],
			"name": "calculatePremium",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "totalPremium",
					"type": "uint256"
				},
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "baseRiskRate",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "regionMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "cropMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "seasonMultiplier",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "loadingFactor",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "durationFactor",
							"type": "uint256"
						}
					],
					"internalType": "struct WeatherInsurance.PremiumCalculation",
					"name": "calculation",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				}
			],
			"name": "calculatePremiumInToken",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "tokenAmount",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes",
					"name": "checkData",
					"type": "bytes"
				}
			],
			"name": "checkUpkeep",
			"outputs": [
				{
					"internalType": "bool",
					"name": "upkeepNeeded",
					"type": "bool"
				},
				{
					"internalType": "bytes",
					"name": "",
					"type": "bytes"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_policyId",
					"type": "uint256"
				}
			],
			"name": "claimPayout",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				}
			],
			"name": "createPolicyOneTime",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_tokenAmount",
					"type": "uint256"
				}
			],
			"name": "createPolicyOneTimeWithToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_installments",
					"type": "uint256"
				}
			],
			"name": "createPolicyRecurring",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "_coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "_coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_deductible",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_installments",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_tokenAmount",
					"type": "uint256"
				}
			],
			"name": "createPolicyRecurringWithToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "emergencyWithdraw",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_token",
					"type": "address"
				}
			],
			"name": "emergencyWithdrawToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "_cropType",
					"type": "uint8"
				}
			],
			"name": "getCropMultiplier",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				}
			],
			"name": "getDurationFactor",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "_duration",
					"type": "uint8"
				}
			],
			"name": "getPolicyDurationSeconds",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getSeasonMultiplier",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				}
			],
			"name": "getStationPolicies",
			"outputs": [
				{
					"internalType": "uint256[]",
					"name": "",
					"type": "uint256[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_user",
					"type": "address"
				}
			],
			"name": "getUserPolicies",
			"outputs": [
				{
					"internalType": "uint256[]",
					"name": "",
					"type": "uint256[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_user",
					"type": "address"
				}
			],
			"name": "getUserRecurringPayments",
			"outputs": [
				{
					"internalType": "uint256[]",
					"name": "",
					"type": "uint256[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "requestId",
					"type": "bytes32"
				},
				{
					"internalType": "bytes",
					"name": "response",
					"type": "bytes"
				},
				{
					"internalType": "bytes",
					"name": "err",
					"type": "bytes"
				}
			],
			"name": "handleOracleFulfillment",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "i_checkInterval",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				}
			],
			"name": "lastCheckTimestamp",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "timeStamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_recurringId",
					"type": "uint256"
				}
			],
			"name": "makeRecurringPayment",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_recurringId",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_tokenAmount",
					"type": "uint256"
				}
			],
			"name": "makeRecurringPaymentWithToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes",
					"name": "performData",
					"type": "bytes"
				}
			],
			"name": "performUpkeep",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				}
			],
			"name": "removeSupportedPaymentToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_stationId",
					"type": "string"
				}
			],
			"name": "requestWeatherData",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "requestId",
					"type": "bytes32"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "s_nextRecurringId",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_pendingPayouts",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_policies",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "id",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "stationId",
					"type": "string"
				},
				{
					"internalType": "enum WeatherInsurance.CoverageType",
					"name": "coverageType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.CropType",
					"name": "cropType",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyDuration",
					"name": "duration",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "coverageAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "totalPremium",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "paidPremium",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "startDate",
					"type": "uint256"
				},
				{
					"internalType": "enum WeatherInsurance.PolicyStatus",
					"name": "status",
					"type": "uint8"
				},
				{
					"internalType": "enum WeatherInsurance.ClaimStatus",
					"name": "claimStatus",
					"type": "uint8"
				},
				{
					"internalType": "uint256",
					"name": "deductible",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "paymentToken",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "recurringPaymentId",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_recurringPayments",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "id",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "policyId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "farmer",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "installmentAmount",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "totalInstallments",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "paidInstallments",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "nextPaymentDue",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "paymentInterval",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "paymentToken",
					"type": "address"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "s_requestIdToPolicy",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "s_requestIdToStation",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_stationPolicies",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_stationWeatherHistory",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "timestamp",
					"type": "uint256"
				},
				{
					"internalType": "uint8",
					"name": "droughtRisk",
					"type": "uint8"
				},
				{
					"internalType": "uint8",
					"name": "floodRisk",
					"type": "uint8"
				},
				{
					"internalType": "uint8",
					"name": "windRisk",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "s_subscriptionId",
			"outputs": [
				{
					"internalType": "uint64",
					"name": "",
					"type": "uint64"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "s_supportedPaymentTokens",
			"outputs": [
				{
					"internalType": "contract AggregatorV3Interface",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_userPolicies",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "s_userRecurringPayments",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "stationCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "stationIdByIndex",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"name": "stationRegionRisk",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "droughtMultiplier",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "floodMultiplier",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "windMultiplier",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "isSet",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "upkeepCheckCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"stateMutability": "payable",
			"type": "receive"
		}
	];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xBF2dd8e225a91D96C76a8449B07A6cbb01d39a34" // Your contract address here

export function useContract() {
  const { signer, provider } = useWallet()
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    if (signer && CONTRACT_ADDRESS) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
    } else if (provider && CONTRACT_ADDRESS) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      setContract(contractInstance)
    } else {
      setContract(null)
    }
  }, [signer, provider])

  return { contract }
}
