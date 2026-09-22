"use client";

import React from "react";
import { CalendarEvent, formatDateToISO } from "../data/calendar-data";
import { cn } from "@/lib/utils";

interface MonthlyViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onOpenMonthlyModal: (date: Date) => void;
  onSelectDate: (date: Date) => void;
}

const MONTH_DAYS_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthlyView({
  selectedDate,
  events,
  onOpenMonthlyModal,
  onSelectDate,
}: MonthlyViewProps) {
  const viewYear = selectedDate.getFullYear();
  const viewMonth = selectedDate.getMonth();

  // Helper to get events on a specific day
  const getEventsForDay = (date: Date) => {
    const iso = formatDateToISO(date);
    return events.filter((e) => e.date === iso);
  };

  // Build grid of cells for month
  const buildMonthGrid = () => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday -> 6

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
      dayOfWeekIndex: number; // 0: Mon ... 6: Sun
    }[] = [];

    // Trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const prevDate = new Date(viewYear, viewMonth - 1, dayNum);
      cells.push({
        date: prevDate,
        dayNum,
        isCurrentMonth: false,
        dayOfWeekIndex: cells.length % 7,
      });
    }

    // Current days
    for (let i = 1; i <= currentMonthDaysCount; i++) {
      const curDate = new Date(viewYear, viewMonth, i);
      cells.push({
        date: curDate,
        dayNum: i,
        isCurrentMonth: true,
        dayOfWeekIndex: cells.length % 7,
      });
    }

    // Leading days
    const totalCells = cells.length > 35 ? 42 : 35;
    const remaining = totalCells - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(viewYear, viewMonth + 1, i);
      cells.push({
        date: nextDate,
        dayNum: i,
        isCurrentMonth: false,
        dayOfWeekIndex: cells.length % 7,
      });
    }

    return cells;
  };

  const grid = buildMonthGrid();

  return (
    <div className="w-full">
      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center pb-4 pt-1">
        {MONTH_DAYS_HEADER.map((day) => (
          <span
            key={day}
            className="text-xs sm:text-sm font-semibold text-[#555555]"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {grid.map((cell, idx) => {
          const isWeekend =
            cell.dayOfWeekIndex === 5 || cell.dayOfWeekIndex === 6;
          const isSelected =
            cell.isCurrentMonth &&
            cell.date.getDate() === selectedDate.getDate() &&
            cell.date.getMonth() === selectedDate.getMonth() &&
            cell.date.getFullYear() === selectedDate.getFullYear();

          const dayEvents = getEventsForDay(cell.date);
          const hasEvents = cell.isCurrentMonth && dayEvents.length > 0;

          // Day 14 or selected date with events has the large expanded card view in the mockup
          const isExpandedCard = isSelected && hasEvents;

          return (
            <div
              key={`${cell.dayNum}-${idx}`}
              onClick={() => {
                onSelectDate(cell.date);
                if (hasEvents) {
                  onOpenMonthlyModal(cell.date);
                }
              }}
              className={cn(
                "min-h-22.5 sm:min-h-26.25 p-2 rounded-md transition-all relative flex flex-col",
                isExpandedCard
                  ? "bg-[#EAF5EE] border border-[#B7E5CD] shadow-xs cursor-pointer hover:bg-[#E2F2E7]"
                  : isWeekend
                    ? "bg-[#F9FAFB] hover:bg-[#F3F4F6] cursor-pointer"
                    : "hover:bg-gray-50 cursor-pointer",
                !cell.isCurrentMonth && "opacity-40",
              )}
            >
              {/* Day Number / Badge */}
              <div className="flex items-center gap-1">
                {hasEvents ? (
                  <div className="size-6 rounded-md bg-[#05512A] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {cell.dayNum}
                  </div>
                ) : (
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium pl-1",
                      !cell.isCurrentMonth ? "text-gray-400" : "text-[#191924]",
                    )}
                  >
                    {cell.dayNum}
                  </span>
                )}
              </div>

              {/* Cell Content */}
              <div className="mt-1 flex-1 flex flex-col justify-start">
                {isExpandedCard ? (
                  /* Expanded List matching Day 14 in Monthly Calendar View.png */
                  <div className="space-y-1.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((item) => (
                      <div key={item.id} className="leading-tight">
                        <p className="text-[11px] font-bold text-[#191924] truncate">
                          {item.clientName.split(",")[0]}
                        </p>
                        <p className="text-[9.5px] text-gray-500 font-medium">
                          {item.startTime.replace(" AM", "").replace(" PM", "")}{" "}
                          - {item.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : hasEvents ? (
                  /* Badge Label "Loan Payment" matching Days 1, 9, 16, 18 in Monthly Calendar View.png */
                  <div className="mt-1">
                    <span className="text-[11px] font-medium text-[#737373] tracking-tight hover:text-[#05512A]">
                      Loan Payment
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
