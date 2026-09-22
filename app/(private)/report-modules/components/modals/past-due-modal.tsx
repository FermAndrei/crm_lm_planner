"use client";

import React, { useEffect } from "react";
import type { PastDue } from "@/services/types/past-due/past-due";

interface PastDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PastDue | null;
}

const formatCurrency = (val: number | undefined | null) => {
  if (!val || val === 0) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date: string | undefined | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PastDueModal({
  isOpen,
  onClose,
  data,
}: PastDueModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#101828]">
            Account Details
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">
            View account information, payment details, and delinquency status.
          </p>
        </div>

        {/* Section 1: Account Information */}
        <div className="mb-5 overflow-hidden rounded-xl border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Account Information
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Branch</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.branch}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">CID</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.cid}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Member Name</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.memberName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Account Number</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.accountNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Product Type</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.productType}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Date Released</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatDate(data.dateReleased)}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="text-xs text-[#667085]">Maturity Date</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatDate(data.maturityDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Details */}
        <div className="mb-5 overflow-hidden rounded-xl border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Payment Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Principal Released</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                ₱ {formatCurrency(data.principalReleased)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Outstanding Principal
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                ₱ {formatCurrency(data.outstandingPrincipal)}
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="text-xs text-[#667085]">
                Date of Last Payment
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.dateOfLastPayment
                  ? formatDate(data.dateOfLastPayment)
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Delinquency Details */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Delinquency & Arrears Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Start Arrears</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.startArrears ? formatDate(data.startArrears) : "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Days of Arrears</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {data.daysOfArrears}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">PAR Amount</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                ₱ {formatCurrency(data.parAmount)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Default Principal</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                ₱ {formatCurrency(data.defaultPrincipal)}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="text-xs text-[#667085]">Default Interest</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                ₱ {formatCurrency(data.defaultInterest)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#05512A]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
