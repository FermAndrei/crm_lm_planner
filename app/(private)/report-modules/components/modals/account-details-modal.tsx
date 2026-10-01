"use client";

import React, { useEffect } from "react";
import type { BranchReportRecord } from "@/services/api-manager/reports/branches/branches-report-type";
import { cn } from "@/lib/utils";

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BranchReportRecord | null;
}

const formatCurrency = (val: number | undefined | null) => {
  if (val == null || isNaN(val)) return "0.00";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date: string | undefined | null) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AccountDetailsModal({
  isOpen,
  onClose,
  data,
}: AccountDetailsModalProps) {
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

  const isApiRecord = (d: unknown): d is BranchReportRecord => {
    return Boolean(
      d &&
      typeof d === "object" &&
      ("account_details" in d || "customer_id" in d),
    );
  };

  const apiRecord = isApiRecord(data) ? data : null;
  const legacyRecord = !isApiRecord(data) ? (data as any) : null;

  const accInfo = apiRecord?.account_details?.account_information;
  const payInfo = apiRecord?.account_details?.payment_details;
  const delInfo = apiRecord?.account_details?.delinquency_details;

  // Account Information
  const dateTime = accInfo?.date_and_time
    ? formatDate(accInfo.date_and_time)
    : apiRecord?.date_and_time
      ? formatDate(apiRecord.date_and_time)
      : legacyRecord?.dateGranted
        ? formatDate(legacyRecord.dateGranted)
        : "-";

  const brCode =
    accInfo?.br_code || apiRecord?.br_code || legacyRecord?.brCode || "-";
  const branch =
    accInfo?.branch || apiRecord?.branch || legacyRecord?.branch || "-";
  const customerId =
    accInfo?.customer_id ||
    apiRecord?.customer_id ||
    legacyRecord?.custId ||
    "-";
  const clientName =
    accInfo?.client_name ||
    apiRecord?.client ||
    legacyRecord?.clientName ||
    "-";
  const accountName =
    accInfo?.account_name ||
    apiRecord?.account ||
    legacyRecord?.accountNumber ||
    "-";
  const originalAmountGranted =
    accInfo?.original_amount_granted ??
    apiRecord?.original_amount_granted ??
    legacyRecord?.originalAmountGranted ??
    0;
  const interestRate =
    accInfo?.interest_rate ??
    apiRecord?.interest_rate ??
    legacyRecord?.interestRate ??
    0;
  const term =
    accInfo?.term ||
    apiRecord?.term_window ||
    (legacyRecord?.dateGranted
      ? `${formatDate(legacyRecord.dateGranted)} - ${formatDate(legacyRecord.maturityDate)}`
      : "-");

  // Payment Details
  const dateGranted = payInfo?.date_granted
    ? formatDate(payInfo.date_granted)
    : apiRecord?.granted
      ? formatDate(apiRecord.granted)
      : legacyRecord?.dateGranted
        ? formatDate(legacyRecord.dateGranted)
        : "-";

  const maturityDate = payInfo?.maturity_date
    ? formatDate(payInfo.maturity_date)
    : apiRecord?.term_window_end_date
      ? formatDate(apiRecord.term_window_end_date)
      : legacyRecord?.maturityDate
        ? formatDate(legacyRecord.maturityDate)
        : "-";

  const outstandingBalance =
    payInfo?.outstanding_balance ??
    apiRecord?.outstanding_balance ??
    legacyRecord?.outstandingBalance ??
    0;

  const prodType =
    payInfo?.product_type ||
    apiRecord?.product_type ||
    legacyRecord?.prodType ||
    "-";
  const agingStatus =
    payInfo?.aging_status ||
    apiRecord?.aging_status ||
    legacyRecord?.agingStatus ||
    "-";
  const loanStatus =
    payInfo?.loan_status ||
    apiRecord?.loan_status ||
    legacyRecord?.loanStatus ||
    "-";

  // Delinquency Details
  const defprin =
    delInfo?.defprin ?? apiRecord?.defprin ?? legacyRecord?.defPrin ?? 0;
  const defint =
    delInfo?.defint ?? apiRecord?.defint ?? legacyRecord?.defInt ?? 0;
  const noOfDaysPastDue =
    delInfo?.no_of_days_past_due ??
    apiRecord?.no_of_days_past_due ??
    legacyRecord?.noOfDaysPastDue ??
    0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-md font-bold text-[#101828]">
            Account Details
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">
            View account information, payment details, and delinquency status.
          </p>
        </div>

        {/* Section 1: Account Information */}
        <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Account Information
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Date & Time</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {dateTime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">BRCode</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {brCode}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Branch</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {branch}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Cust_ID</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {customerId}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Client Name</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {clientName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Account Name</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {accountName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Original Amount Granted
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(originalAmountGranted)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Interest Rate</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {interestRate}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Term</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {term}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Payment Details */}
        <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Payment Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Date Granted</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {dateGranted}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Maturity Date</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {maturityDate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Outstanding Balance
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(outstandingBalance)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">ProdType</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {prodType}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Aging Status</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {agingStatus}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Loan Status</span>
              <div className="mt-1">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
                    loanStatus === "CURRENT"
                      ? "bg-[#DCFCE7] text-[#15803D]"
                      : loanStatus === "EXPIRED"
                        ? "bg-[#FFE4E8] text-[#E11D48]"
                        : "bg-[#F4F2FA] text-[#5a5a70]",
                  )}
                >
                  {loanStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delinquency Details */}
        <div className="mb-6 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Delinquency Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Defprin</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(defprin)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Defint</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {formatCurrency(defint)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                No of Days Past Due
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {noOfDaysPastDue}
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
