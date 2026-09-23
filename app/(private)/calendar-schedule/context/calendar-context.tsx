"use client";

import React, { createContext, useContext, useState } from "react";
import {
  CalendarEvent,
  INITIAL_EVENTS,
} from "@/app/(private)/calendar-schedule/data/calendar-data";

export type CalendarViewType = "Daily" | "Weekly" | "Monthly";

interface CalendarContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  activeView: CalendarViewType;
  setActiveView: (view: CalendarViewType) => void;
  category: string;
  setCategory: (cat: string) => void;

  // Calendar Picker Popover
  isCalendarPickerOpen: boolean;
  setIsCalendarPickerOpen: (open: boolean) => void;
  toggleCalendarPicker: () => void;

  // Modals
  selectedDailyEvent: CalendarEvent | null;
  setSelectedDailyEvent: (event: CalendarEvent | null) => void;
  isMonthlyModalOpen: boolean;
  setIsMonthlyModalOpen: (open: boolean) => void;
  monthlyModalDate: Date | null;
  setMonthlyModalDate: (date: Date | null) => void;
  openMonthlyModalForDate: (date: Date) => void;

  // Events data
  events: CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  // Default to September 14, 2026 to match mockups
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(2026, 8, 14) // month is 0-indexed: 8 = September
  );
  const [activeView, setActiveView] = useState<CalendarViewType>("Daily");
  const [category, setCategory] = useState<string>("Loan Payment");

  const [isCalendarPickerOpen, setIsCalendarPickerOpen] = useState(false);

  const [selectedDailyEvent, setSelectedDailyEvent] =
    useState<CalendarEvent | null>(null);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [monthlyModalDate, setMonthlyModalDate] = useState<Date | null>(null);

  const toggleCalendarPicker = () => {
    setIsCalendarPickerOpen((prev) => !prev);
  };

  const openMonthlyModalForDate = (date: Date) => {
    setMonthlyModalDate(date);
    setIsMonthlyModalOpen(true);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        activeView,
        setActiveView,
        category,
        setCategory,
        isCalendarPickerOpen,
        setIsCalendarPickerOpen,
        toggleCalendarPicker,
        selectedDailyEvent,
        setSelectedDailyEvent,
        isMonthlyModalOpen,
        setIsMonthlyModalOpen,
        monthlyModalDate,
        setMonthlyModalDate,
        openMonthlyModalForDate,
        events: INITIAL_EVENTS,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
