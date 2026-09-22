"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose?: () => void;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  onClose,
  className,
}: CalendarPickerProps) {
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth()); // 0-indexed
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with selectedDate when it changes externally
  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Build grid of 42 cells (6 rows x 7 cols)
  const buildCalendarGrid = () => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    // Sunday is 0, Monday is 1, ..., Saturday is 6
    // We want Monday to be 0
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6; // Sunday becomes 6

    const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();
    const currentMonthDaysCount = new Date(
      viewYear,
      viewMonth + 1,
      0,
    ).getDate();

    const cells: {
      date: Date;
      dayNum: number;
      isCurrentMonth: boolean;
      isPrevMonth: boolean;
      isNextMonth: boolean;
    }[] = [];

    // Previous month trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const prevDate = new Date(viewYear, viewMonth - 1, dayNum);
      cells.push({
        date: prevDate,
        dayNum,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= currentMonthDaysCount; i++) {
      const curDate = new Date(viewYear, viewMonth, i);
      cells.push({
        date: curDate,
        dayNum: i,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      });
    }

    // Next month leading days to complete grid (up to 35 or 42)
    const remaining =
      35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      cells.push({
        date: nextDate,
        dayNum: i,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      });
    }

    return cells;
  };

  const cells = buildCalendarGrid();

  const isSelectedDate = (date: Date) => {
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  // Generate range of years
  const currentActualYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentActualYear - 5 + i);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-85 sm:w-92.5 bg-white rounded-md p-5 sm:p-6 shadow-2xl border border-gray-100/90 select-none z-50 animate-in fade-in zoom-in-95 duration-150",
        className,
      )}
    >
      {/* Header with Navigation and Dropdowns */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* Previous Month */}
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Month & Year Selectors */}
        <div className="flex items-center gap-2 relative">
          {/* Month Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsMonthDropdownOpen((prev) => !prev);
                setIsYearDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200/90 text-sm font-semibold text-[#191924] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{MONTH_NAMES[viewMonth]}</span>
              <ChevronDown className="size-4 text-gray-500" />
            </button>

            {isMonthDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 max-h-56 w-36 overflow-y-auto bg-white rounded-md border border-gray-100 shadow-xl p-1 z-50">
                {MONTH_NAMES.map((name, idx) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setViewMonth(idx);
                      setIsMonthDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors",
                      viewMonth === idx
                        ? "bg-[#05512A] text-white font-bold"
                        : "text-[#191924] hover:bg-gray-100",
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsYearDropdownOpen((prev) => !prev);
                setIsMonthDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200/90 text-sm font-semibold text-[#191924] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{viewYear}</span>
              <ChevronDown className="size-4 text-gray-500" />
            </button>

            {isYearDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 max-h-56 w-28 overflow-y-auto bg-white rounded-md border border-gray-100 shadow-xl p-1 z-50">
                {years.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setViewYear(y);
                      setIsYearDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors",
                      viewYear === y
                        ? "bg-[#05512A] text-white font-bold"
                        : "text-[#191924] hover:bg-gray-100",
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Month */}
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="text-xs font-medium text-[#71717A] py-1">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((cell, idx) => {
          const isSelected = isSelectedDate(cell.date);
          // In the design mockup (September 2026), 15, 16, 17, 18, 19 are green
          const isHighlightedWeekday =
            cell.isCurrentMonth &&
            viewMonth === 8 &&
            viewYear === 2026 &&
            [15, 16, 17, 18, 19].includes(cell.dayNum);

          const isMutedDays =
            !cell.isCurrentMonth ||
            (cell.isCurrentMonth &&
              viewMonth === 8 &&
              viewYear === 2026 &&
              [1, 2, 3].includes(cell.dayNum));

          return (
            <div
              key={`${cell.dayNum}-${idx}`}
              className="flex items-center justify-center p-0.5"
            >
              <button
                type="button"
                onClick={() => {
                  onSelectDate(cell.date);
                  onClose?.();
                }}
                className={cn(
                  "size-9 sm:size-10 rounded-md flex items-center justify-center text-sm font-medium transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#05512A] text-white font-bold shadow-md hover:bg-[#044423]"
                    : isHighlightedWeekday
                      ? "text-[#1E6E25] font-semibold hover:bg-emerald-50"
                      : isMutedDays
                        ? "text-[#A1A1AA] hover:bg-gray-100 hover:text-[#191924]"
                        : "text-[#18181B] hover:bg-gray-100",
                )}
              >
                {cell.dayNum}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
