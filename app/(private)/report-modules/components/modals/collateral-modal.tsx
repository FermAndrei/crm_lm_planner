"use client";

import React, { useEffect } from "react";
import type { WithCollateralRecord } from "@/services/api-manager/reports/with-collateral/with-collateral-type";

interface CollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WithCollateralRecord | null;
}

const formatCurrency = (val: number | string | undefined | null) => {
  if (val == null || val === "" || val === "-") return "—";
  if (typeof val === "string" && val.includes("₱")) return val;
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return `₱ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDisplayDate = (date: string | undefined | null) => {
  if (!date || date === "-" || date === "—") return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CollateralModal({
  isOpen,
  onClose,
  data,
}: CollateralModalProps) {
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

  const acctInfo = data.account_information;
  const collInfo = data.collateral_information;
  const apprDetails = data.appraisal_details;
  const addDetails = data.additional_details;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#101828]">
            Collateral Details
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">
            View collateral information, borrower details, and appraisal status.
          </p>
        </div>

        {/* Section 1: Collateral Information */}
        <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Collateral Information
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Branch Booked</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {acctInfo?.branch_booked || data.branch_booked || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Collateral Type</span>
              <span className="mt-0.5 text-sm font-bold font-mono text-[#101828]">
                {collInfo?.collateral_type || data.collateral_type || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Collateral Code</span>
              <span className="mt-0.5 text-sm font-bold font-mono text-[#101828]">
                {collInfo?.collateral_code || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Collateral Description
              </span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {collInfo?.collateral_description ||
                  collInfo?.description ||
                  "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Collateral Code Desc.
              </span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {collInfo?.collateral_code_description || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Sequence</span>
              <span className="mt-0.5 text-sm font-mono text-[#101828]">
                {acctInfo?.sequence || data.sequence || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Borrower & Loan Details */}
        <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Borrower & Loan Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Name of Borrower</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {acctInfo?.name_of_borrower || data.borrower || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">CID No.</span>
              <span className="mt-0.5 text-sm font-mono text-[#101828]">
                {acctInfo?.cid_no || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Account Number</span>
              <span className="mt-0.5 text-sm font-bold font-mono text-[#101828]">
                {acctInfo?.account_number_of_loan ||
                  data.account_number ||
                  "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Date & Time</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {acctInfo?.date_and_time || "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Appraise Value</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(
                  apprDetails?.appraisal_value || data.appraisal_value,
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Loan Value</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(apprDetails?.loan_value || data.loan_value)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Appraisal & Schedule */}
        <div className="mb-6 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Appraisal & Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Date of Appraisal</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {formatDisplayDate(
                  apprDetails?.date_of_appraisal || data.date_of_appraisal,
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Review Date</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {formatDisplayDate(apprDetails?.review_date_fqu)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Value Date</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {formatDisplayDate(apprDetails?.value_date)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Expiry Date</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {formatDisplayDate(apprDetails?.expiry_date)}
              </span>
            </div>
            <div className="flex flex-col sm:col-span-2">
              <span className="text-xs text-[#667085]">Address / Notes</span>
              <span className="mt-0.5 text-sm font-medium text-[#101828]">
                {addDetails?.address_notes || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#05512A]/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

