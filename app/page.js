"use client"

import { useState } from "react"
import LeaseAbstract from "../components/lease-abstract/LeaseAbstract"
import Tabs from "../components/Tabs"
import Header from "../components/Header"

const Page = () => {
  const [activeTab, setActiveTab] = useState("lease")

  const leaseData = {
    tenant: {
      name: "Amazon",
      creditRating: "AA",
      industry: "E-commerce & Logistics",
      parentCompany: "Amazon.com, Inc.",
      stockSymbol: "AMZN",
    },
    property: {
      address: "280 Richards",
      location: "Brooklyn, NY",
      squareFootage: 312000,
      buildingClass: "A",
      yearBuilt: 2019,
    },
    lease: {
      startDate: "2020-06-01",
      expiryDate: "2035-05-31",
      term: 15,
      remainingTerm: 10.4,
      baseRent: 458,
      rentComponents: [
        { type: "Base Rent", amount: 458, psf: true },
        { type: "Operating Expenses", amount: 12.5, psf: true },
        { type: "Property Taxes", amount: 8.75, psf: true },
        { type: "Insurance", amount: 2.25, psf: true },
      ],
      escalations: [
        { year: 1, rate: "3.0%", amount: 458.0 },
        { year: 2, rate: "3.0%", amount: 471.74 },
        { year: 3, rate: "3.0%", amount: 485.89 },
        { year: 4, rate: "3.0%", amount: 500.47 },
        { year: 5, rate: "3.5%", amount: 517.98 },
      ],
      renewalOptions: [
        { term: 5, type: "Market", notice: "12 months" },
        { term: 5, type: "Market", notice: "12 months" },
      ],
      recoveryTerms: {
        cam: "Triple Net (NNN)",
        taxes: "100% of increases over 2020 base year",
        insurance: "100% of increases over 2020 base year",
      },
      securityDeposit: "$11,500,000",
      tlAllowance: "$125 PSF",
      specialProvisions: [
        "Right of First Refusal on adjacent space",
        "24/7 access to premises",
        "Signage rights on building exterior",
      ],
    },
    riskFactors: [
      { type: "Lease Expiration", risk: "Low", description: "10+ years remaining on primary term" },
      { type: "Tenant Default", risk: "Low", description: "Strong credit tenant (AA rating)" },
      { type: "Market Rent Decline", risk: "Medium", description: "Current rent above market by ~5%" },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Deal Overview</h1>
        </div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "lease" && <LeaseAbstract data={leaseData} />}
      </main>
    </div>
  )
}

export default Page
