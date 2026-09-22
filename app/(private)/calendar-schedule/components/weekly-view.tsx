"use client";

import React from "react";
import {
  CalendarEvent,
  WEEKLY_HOURS,
  getWeekDays,
  formatDateToISO,
  formatSimpleCurrency,
} from "../data/calendar-data";
import { cn } from "@/lib/utils";

interface WeeklyViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (date: Date) => void;
}

const WEEK_DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyView({
  selectedDate,
  events,
  onSelectEvent,
  onSelectDate,
}: WeeklyViewProps) {
  const weekDays = getWeekDays(selectedDate);
  const selectedDateISO = formatDateToISO(selectedDate);

  // Helper to find event for a specific day and hour slot
  const getEventForSlot = (day: Date, hourStr: string) => {
    const dayISO = formatDateToISO(day);
    return events.find((e) => e.date === dayISO && e.startTime === hourStr);
  };

  // Determine if hour row has any events across the week (to highlight hour label)
  const isHourActive = (hourStr: string) => {
    return weekDays.some((day) => {
      const dayISO = formatDateToISO(day);
      return events.some((e) => e.date === dayISO && e.startTime === hourStr);
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-190">
        {/* Weekday Header Columns */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] items-center pb-6 pt-2">
          {/* Top-left empty header above time slots */}
          <div />

          {/* 7 Days Headers */}
          {weekDays.map((day, idx) => {
            const dayISO = formatDateToISO(day);
            const isSelected = dayISO === selectedDateISO;

            return (
              <div
                key={dayISO}
                onClick={() => onSelectDate(day)}
                className="flex flex-col items-center justify-center cursor-pointer transition-all px-1"
              >
                {isSelected ? (
                  <div className="w-full max-w-32.5 bg-[#05512A] text-white rounded-md py-2.5 px-3 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-xs font-semibold">
                      {WEEK_DAY_LABELS[idx]}
                    </span>
                    <span className="text-lg sm:text-xl font-bold mt-0.5">
                      {day.getDate()}
                    </span>
                  </div>
                ) : (
                  <div className="w-full max-w-32.5 hover:bg-gray-50 rounded-md py-2.5 px-3 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-[#737373]">
                      {WEEK_DAY_LABELS[idx]}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#05512A] mt-0.5">
                      {day.getDate()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slot Rows */}
        <div className="flex flex-col divide-y divide-gray-200/70 border-t border-gray-200/70">
          {WEEKLY_HOURS.map((hour) => {
            const activeHour = isHourActive(hour);

            return (
              <div
                key={hour}
                className="grid grid-cols-[80px_repeat(7,1fr)] items-start min-h-24 py-2"
              >
                {/* Time Label */}
                <div className="py-2 pr-3">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight",
                      activeHour ? "text-[#05512A] font-bold" : "text-gray-400",
                    )}
                  >
                    {hour}
                  </span>
                </div>

                {/* 7 Day Slot Cells */}
                {weekDays.map((day) => {
                  const dayISO = formatDateToISO(day);
                  const event = getEventForSlot(day, hour);

                  return (
                    <div
                      key={`${dayISO}-${hour}`}
                      className="px-1.5 py-1 min-h-20 h-full"
                    >
                      {event && (
                        <div
                          onClick={() => onSelectEvent(event)}
                          className="bg-[#F7F7F8] hover:bg-[#EEF5F1] border border-gray-200/70 hover:border-[#05512A]/40 rounded-md p-3 shadow-2xs transition-all cursor-pointer h-full flex flex-col justify-center"
                        >
                          <h5 className="text-[11px] font-bold text-[#05512A] tracking-tight uppercase line-clamp-2">
                            {event.clientName}
                          </h5>
                          <p className="text-xs font-bold text-[#191924] mt-1.5">
                            {formatSimpleCurrency(event.amount)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
