"use client";

import { Filter } from "lucide-react";
import React from "react";

interface SegmentButtonProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export const SegmentButton = ({
  tabs,
  activeTab,
  onChange,
}: SegmentButtonProps) => {
  return (
    <div className="relative">
      <div className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-700">
        <Filter size={14} className="shrink-0 text-[#05582E]" />
        <span className="whitespace-nowrap">Filter:</span>
        <select
          value={activeTab}
          onChange={(e) => onChange(e.target.value)}
          className="cursor-pointer bg-transparent pr-2 font-bold text-gray-900 outline-none"
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
