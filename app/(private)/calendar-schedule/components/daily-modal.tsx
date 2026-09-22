"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  CalendarEvent,
  formatFullDate,
  formatCurrency,
} from "../data/calendar-data";

interface DailyModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  selectedDate: Date;
}

export function DailyModal({ event, onClose, selectedDate }: DailyModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100/90 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="pr-8">
          <h2 className="text-2xl font-bold text-[#191924] tracking-tight">
            Loan Payment Detail
          </h2>
          <p className="text-sm font-medium text-[#737373] mt-1">
            {formatFullDate(selectedDate)}
          </p>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200/80 my-5" />

        {/* Content Fields */}
        <div className="space-y-5">
          <div>
            <span className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider">
              SCHEDULE TIME
            </span>
            <p className="text-base sm:text-lg font-bold text-[#191924] mt-1">
              {event.modalTimeRange || `${event.startTime} - ${event.endTime}`}
            </p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider">
              CLIENT NAME
            </span>
            <p className="text-base sm:text-lg font-bold text-[#191924] mt-1">
              {event.clientName}
            </p>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#737373] uppercase tracking-wider">
              AMOUNT
            </span>
            <p className="text-lg sm:text-xl font-bold text-[#05512A] mt-1">
              {formatCurrency(event.amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
