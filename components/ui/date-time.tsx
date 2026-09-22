"use client";

import { Calendar, Clock } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useCalendar } from "@/context/calendar-context";
import { CalendarPicker } from "@/app/(private)/calendar-schedule/components/calendar-picker";

export default function DateAndTime() {
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    selectedDate,
    setSelectedDate,
    isCalendarPickerOpen,
    setIsCalendarPickerOpen,
    toggleCalendarPicker,
  } = useCalendar();

  useEffect(() => {
    // Set the initial time on the client
    setCurrentDateTime(new Date());

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date to match mockup: "September 14, 2026"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Close calendar picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsCalendarPickerOpen]);

  // Display selectedDate from context for date, and live time for clock
  const displayDate = selectedDate || currentDateTime || new Date(2026, 8, 14);

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={toggleCalendarPicker}
        className="hidden items-center gap-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50/90 px-3 py-1.5 lg:flex cursor-pointer transition-colors shadow-2xs group"
        title="Click to open calendar picker"
        role="button"
        tabIndex={0}
      >
        {/* Date Section */}
        <div className="flex items-center gap-2">
          <Calendar
            size={14}
            className="text-[#1E6E25] group-hover:scale-105 transition-transform"
          />
          <span className="text-xs font-semibold text-[#1E6E25]">
            {formatDate(displayDate)}
          </span>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        {/* Time Section */}
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#1E6E25]" />
          <span className="font-mono text-xs font-bold text-[#1E6E25]">
            {currentDateTime ? formatTime(currentDateTime) : "10:30 AM"}
          </span>
        </div>
      </div>

      {/* Calendar Picker Popover */}
      {isCalendarPickerOpen && (
        <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <CalendarPicker
            selectedDate={displayDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setIsCalendarPickerOpen(false);
            }}
            onClose={() => setIsCalendarPickerOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
