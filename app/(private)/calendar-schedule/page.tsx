"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useCalendar, CalendarViewType } from "@/context/calendar-context";
import { DailyView } from "./components/daily-view";
import { WeeklyView } from "./components/weekly-view";
import { MonthlyView } from "./components/monthly-view";
import { DailyModal } from "./components/daily-modal";
import { MonthlyModal } from "./components/monthly-modal";
import { CalendarPicker } from "./components/calendar-picker";
import {
  CalendarEvent,
  formatShortDate,
  formatWeekRange,
} from "./data/calendar-data";
import { cn } from "@/lib/utils";

const SEGMENT_TABS: CalendarViewType[] = ["Daily", "Weekly", "Monthly"];
const CATEGORY_OPTIONS = [
  "Loan Payment",
  "Loan Release",
  "Past Due Collection",
  "All Types",
];

export default function CalendarSchedulePage() {
  const {
    selectedDate,
    setSelectedDate,
    activeView,
    setActiveView,
    category,
    setCategory,
    selectedDailyEvent,
    setSelectedDailyEvent,
    isMonthlyModalOpen,
    setIsMonthlyModalOpen,
    monthlyModalDate,
    setMonthlyModalDate,
    events,
  } = useCalendar();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isInlinePickerOpen, setIsInlinePickerOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const dateNavRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
      if (
        dateNavRef.current &&
        !dateNavRef.current.contains(e.target as Node)
      ) {
        setIsInlinePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Previous date navigation based on active view
  const handlePrevDate = () => {
    const next = new Date(selectedDate);
    if (activeView === "Daily") {
      next.setDate(next.getDate() - 1);
    } else if (activeView === "Weekly") {
      next.setDate(next.getDate() - 7);
    } else {
      next.setMonth(next.getMonth() - 1);
    }
    setSelectedDate(next);
  };

  // Next date navigation based on active view
  const handleNextDate = () => {
    const next = new Date(selectedDate);
    if (activeView === "Daily") {
      next.setDate(next.getDate() + 1);
    } else if (activeView === "Weekly") {
      next.setDate(next.getDate() + 7);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
    setSelectedDate(next);
  };

  // Date range label for the right-side navigator
  const getDateRangeLabel = () => {
    if (activeView === "Weekly") {
      return formatWeekRange(selectedDate);
    }
    return formatShortDate(selectedDate);
  };

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Top Filter Controls (Loan Payment Selector) */}
      <div className="flex items-center justify-between">
        <div className="relative" ref={categoryRef}>
          <button
            type="button"
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white rounded-md border border-gray-200/90 text-sm font-semibold text-[#191924] hover:bg-gray-50/80 transition-colors cursor-pointer shadow-2xs min-w-42.5"
          >
            <span>{category}</span>
            <ChevronDown
              className={cn(
                "size-4 text-gray-500 transition-transform duration-200",
                isCategoryOpen && "rotate-180",
              )}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-md border border-gray-100 shadow-xl p-1.5 z-40">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setIsCategoryOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs rounded-sm font-medium transition-colors cursor-pointer",
                    category === cat
                      ? "bg-[#05512A] text-white font-semibold"
                      : "text-[#191924] hover:bg-gray-100",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Calendar Card Container */}
      <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200/70">
        {/* Card Header: Segment Button on Left & Date Navigator on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          {/* Segment Control */}
          <div className="bg-[#F4F4F6] p-1 rounded-md flex items-center w-fit shadow-2xs">
            {SEGMENT_TABS.map((tab) => {
              const isActive = activeView === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveView(tab)}
                  className={cn(
                    "cursor-pointer rounded-md px-6 py-1.5 text-xs sm:text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#05512A] font-semibold text-white shadow-xs"
                      : "text-[#666666] hover:text-[#191924]",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Date Navigator & Inline Date Picker Trigger */}
          <div className="relative" ref={dateNavRef}>
            <div className="flex items-center rounded-md border border-gray-200/90 bg-white px-2 py-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevDate}
                className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                title="Previous"
              >
                <ChevronLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsInlinePickerOpen((prev) => !prev)}
                className="px-3 py-1 text-xs sm:text-sm font-semibold text-[#191924] hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                {getDateRangeLabel()}
              </button>

              <button
                type="button"
                onClick={handleNextDate}
                className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                title="Next"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Inline Calendar Picker Popover */}
            {isInlinePickerOpen && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <CalendarPicker
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setIsInlinePickerOpen(false);
                  }}
                  onClose={() => setIsInlinePickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* View Body */}
        <div className="pt-4 min-h-105">
          {activeView === "Daily" && (
            <DailyView
              selectedDate={selectedDate}
              events={events}
              onSelectEvent={(evt) => setSelectedDailyEvent(evt)}
            />
          )}

          {activeView === "Weekly" && (
            <WeeklyView
              selectedDate={selectedDate}
              events={events}
              onSelectEvent={(evt) => setSelectedDailyEvent(evt)}
              onSelectDate={(date) => {
                setSelectedDate(date);
              }}
            />
          )}

          {activeView === "Monthly" && (
            <MonthlyView
              selectedDate={selectedDate}
              events={events}
              onOpenMonthlyModal={(date) => {
                setMonthlyModalDate(date);
                setIsMonthlyModalOpen(true);
              }}
              onSelectDate={(date) => {
                setSelectedDate(date);
              }}
            />
          )}
        </div>
      </div>

      {/* Selected Daily Modal */}
      <DailyModal
        event={selectedDailyEvent}
        selectedDate={selectedDate}
        onClose={() => setSelectedDailyEvent(null)}
      />

      {/* Selected Monthly Modal */}
      <MonthlyModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        date={monthlyModalDate || selectedDate}
        events={events}
        onSelectEvent={(evt: CalendarEvent) => {
          setSelectedDailyEvent(evt);
        }}
      />
    </div>
  );
}
