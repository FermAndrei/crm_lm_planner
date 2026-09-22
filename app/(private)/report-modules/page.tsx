"use client";

import { useState } from "react";
import { SegmentButton } from "@/components/ui/segment-button";
import AllBranch from "./components/all-branch";
import ByBranch from "./components/by-branch";
import ProductTypePage from "./components/product-type";
import PastDue from "./components/past-due";
import WriteOff from "./components/charged-off";
import WithCollateral from "./components/with-collateral";

export default function ReportModulePage() {
  const [activeTab, setActiveTab] = useState("All Branches");

  const tabs = [
    "All Branches",
    "By Branch",
    "By Product Type",
    "Past Due Client",
    "Charged Off Client",
    "Charged W/ Collateral",
  ];

  return (
    <div className="space-y-4 p-4 md:p-8">
      {/* Segment Filter Tabs */}
      <div>
        <SegmentButton
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Active Table Content */}
      <div className="min-w-0">
        {activeTab === "All Branches" && <AllBranch />}
        {activeTab === "By Branch" && <ByBranch />}
        {activeTab === "By Product Type" && <ProductTypePage />}
        {activeTab === "Past Due Client" && <PastDue />}
        {activeTab === "Charged Off Client" && <WriteOff />}
        {activeTab === "Charged W/ Collateral" && <WithCollateral />}
      </div>
    </div>
  );
}
