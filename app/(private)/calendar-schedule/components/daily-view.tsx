"use client";

import React from "react";
import {
  CalendarEvent,
  DAILY_HOURS,
  formatSimpleCurrency,
  formatDateToISO,
} from "../data/calendar-data";
import { cn } from "@/lib/utils";

interface DailyViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function DailyView({
  selectedDate,
  events,
  onSelectEvent,
}: DailyViewProps) {
  const currentDateISO = formatDateToISO(selectedDate);
  const dayEvents = events.filter((e) => e.date === currentDateISO);

  // Group events by hour prefix (e.g. "08:00 AM")
  const getEventForHour = (hourStr: string) => {
    return dayEvents.find((e) => e.startTime === hourStr);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {DAILY_HOURS.map((hour) => {
          const event = getEventForHour(hour);
          const hasEvent = Boolean(event);

          return (
            <div
              key={hour}
              className="group flex flex-col sm:flex-row items-stretch border-b border-gray-200/70 last:border-b-0 min-h-16 sm:min-h-18 transition-colors"
            >
              {/* Left Hour Label */}
              <div className="w-24 sm:w-28 shrink-0 py-3 sm:py-4 pr-4">
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold tracking-tight transition-colors",
                    hasEvent
                      ? "text-[#05512A] font-bold"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                >
                  {hour}
                </span>
              </div>

              {/* Event slot or empty row */}
              <div className="flex-1 py-1.5 sm:py-2">
                {event ? (
                  <div
                    onClick={() => onSelectEvent(event)}
                    className="h-full bg-[#F7F7F8] hover:bg-[#EFF6F2] border border-gray-200/70 hover:border-[#05512A]/40 rounded-md p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#05512A] tracking-tight uppercase truncate">
                        {event.clientName}
                      </h4>
                      <div className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 flex flex-wrap items-center gap-1.5">
                        <span>Account: {event.accountNo}</span>
                        <span>•</span>
                        <span>
                          Amount: {formatSimpleCurrency(event.amount)}
                        </span>
                        <span>•</span>
                        <span>{event.productType}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <span className="text-xs sm:text-sm font-bold text-[#05512A]">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-9" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
