"use client";

import { useState } from "react";
import { SegmentButton } from "@/components/ui/segment-button";
import AllBranch from "./components/all-branch";
import ByBranch from "./components/by-branch";
import ProductTypePage from "./components/product-type";
import DateAndTime from "@/components/ui/date-time";
import PastDue from "./components/past-due";
import WriteOff from "./components/writeoff";
import WithCollateral from "./components/with-collateral";

export default function ClientProfilePage() {
  const [activeTab, setActiveTab] = useState("All Branch");

  const tabs = [
    "All Branch",
    "By Branch",
    "By Product Type",
    "Past Due Client",
    "Charged Off Client",
    "Charge W/ Collateral",
  ];

  return (
    <div className="space-y-4 p-4 md:p-8">
      {/* Header Card */}
      <div className="overflow-hidden rounded-3xl border border-[#191924]/8 bg-white p-6 md:p-8 shadow-cloud-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1EEF8] pb-5 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#191924]">
              CARD SME Bank Data Platform
            </h1>
            <p className="text-xs sm:text-sm text-[#5a5a70] font-medium mt-0.5">
              Comprehensive client profiles, past due watchlists, collateral
              verification, and charge-off ledgers.
            </p>
          </div>
          <DateAndTime />
        </div>

        {/* Segment Filter Tabs */}
        <div className="mb-6">
          <SegmentButton
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Active Table Content */}
        <div className="min-w-0">
          {activeTab === "All Branch" && <AllBranch />}
          {activeTab === "By Branch" && <ByBranch />}
          {activeTab === "By Product Type" && <ProductTypePage />}
          {activeTab === "Past Due Client" && <PastDue />}
          {activeTab === "Charged Off Client" && <WriteOff />}
          {activeTab === "Charge W/ Collateral" && <WithCollateral />}
        </div>
      </div>
    </div>
  );
}
