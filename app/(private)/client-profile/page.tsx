"use client";

import { BarChart3, Calendar, Clock, Filter, Table2 } from "lucide-react";
import { useState } from "react";
import { SegmentButton } from "../../../components/ui/segment-button";
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

  const getActiveTitle = () => {
    switch (activeTab) {
      case "All Branch":
        return "All Branch";

      case "By Branch":
        return "By Branch";

      case "By Product Type":
        return "By Product Type";

      case "Past Due Client":
        return "Past Due Client";

      case "Charged Off Client":
        return "Charged Off Client";

      case "Charge W/ Collateral":
        return "Charge W/ Collateral";

      default:
        return "";
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold text-[#1E4637]">
            CARD SME BANK INC DATA PLATFORM
          </h1>

          {/* <DateAndTime /> */}
        </div>

        {/* Date & Time */}

        {/* Segment */}
        <div>
          <div className="flex justify-between">
            <div className="flex gap-2 mt-2">
              {/* <h2 className="text-2xl font-bold text-gray-700">
                {getActiveTitle()}
              </h2> */}
              <SegmentButton
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="">
            {activeTab === "All Branch" && <AllBranch />}

            {activeTab === "By Branch" && <ByBranch />}

            {activeTab === "By Product Type" && <ProductTypePage />}

            {activeTab === "Past Due Client" && <PastDue />}

            {activeTab === "Charged Off Client" && <WriteOff />}

            {activeTab === "Charge W/ Collateral" && <WithCollateral />}
          </div>
        </div>
      </div>
    </div>
  );
}
