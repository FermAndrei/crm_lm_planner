"use client";

import { Filter } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

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
      {/* Desktop & Tablet Segment Pills */}
      <div className="hidden w-fit md:flex flex-wrap items-center gap-1 rounded-full border border-gray-200/80 bg-white p-1 shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-[#05512A] font-semibold text-white shadow-xs"
                  : "text-[#555555] hover:bg-black/5 hover:text-[#191924]",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Mobile Select Dropdown */}
      <div className="flex md:hidden w-fit items-center gap-2 rounded-full border border-[#191924]/8 bg-[#FAF9FD] px-4 py-2 text-xs font-semibold text-[#5a5a70] shadow-cloud-pill">
        <Filter size={13} className="shrink-0 text-[#2f8b23]" />
        <span className="whitespace-nowrap uppercase tracking-wider text-[10.5px] font-bold text-[#9a9ab0]">
          Filter:
        </span>
        <select
          value={activeTab}
          onChange={(e) => onChange(e.target.value)}
          className="cursor-pointer bg-transparent pr-2 font-bold text-[#191924] outline-none"
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
