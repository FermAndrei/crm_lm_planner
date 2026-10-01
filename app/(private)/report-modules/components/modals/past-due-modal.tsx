"use client";

import React, { useEffect } from "react";
import type { PastDueRecord } from "@/services/api-manager/reports/past-due/past-due-type";

interface PastDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PastDueRecord | null;
}

const formatDisplayDate = (date: string | undefined | null) => {
  if (!date || date === "No Data" || date === "-" || date === "—")
    return date || "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
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

  const clientName =
    data.client || data.client_information?.client || data.member_name || "—";

  const branch = data.branch || data.client_information?.branch || "—";

  const cid = data.cid || data.client_information?.cid || "—";

  const hasNewLoanAccounts =
    Array.isArray(data.loan_accounts) && data.loan_accounts.length > 0;

  // Fallback data for legacy structure
  const legacyAccountInfo = data.account_information;
  const legacyPrincipalBal = data.principal_balance;
  const legacyArrears = data.arrears_details;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-md bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#101828]">
              Past Due Client Details
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#667085]">
              View client information, loan accounts, and arrears status.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#05512A]/10 px-3 py-1 text-xs font-semibold text-[#05512A]">
              CID: {cid}
            </span>
          </div>
        </div>

        {/* Section 1: Client Overview Information */}
        <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
              Client Information
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">
                Client / Member Name
              </span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {clientName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">Branch</span>
              <span className="mt-0.5 text-sm font-bold text-[#101828]">
                {branch}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#667085]">CID</span>
              <span className="mt-0.5 text-sm font-bold font-mono text-[#101828]">
                {cid}
              </span>
            </div>

            {/* Total summary metrics if available */}
            {data.formatted_total_loan && (
              <div className="flex flex-col">
                <span className="text-xs text-[#667085]">Total Loan</span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  {data.formatted_total_loan}
                </span>
              </div>
            )}
            {data.formatted_outstanding_balance && (
              <div className="flex flex-col">
                <span className="text-xs text-[#667085]">
                  Total Outstanding Balance
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  {data.formatted_outstanding_balance}
                </span>
              </div>
            )}
            {data.formatted_par_amount && (
              <div className="flex flex-col">
                <span className="text-xs text-[#667085]">Total PAR Amount</span>
                <span className="mt-0.5 text-sm font-bold text-[#E11D48]">
                  {data.formatted_par_amount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Loan Accounts (New Response Structure) */}
        {hasNewLoanAccounts ? (
          <div className="space-y-5">
            {data.loan_accounts!.map((loanAcc, index) => {
              const accInfo = loanAcc.account_information;
              const arrears = loanAcc.arrears_details;

              return (
                <div
                  key={accInfo?.account_number || index}
                  className="rounded-md border border-gray-200/90 bg-white overflow-hidden shadow-xs"
                >
                  {/* Account Card Header */}
                  <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
                        Loan Account{" "}
                        {data.loan_accounts!.length > 1 ? `#${index + 1}` : ""}
                      </span>
                      {accInfo?.account_number && (
                        <span className="text-xs font-mono font-semibold text-[#101828]">
                          ({accInfo.account_number})
                        </span>
                      )}
                    </div>
                    {accInfo?.pd_type && (
                      <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10.5px] font-bold text-red-600 uppercase">
                        {accInfo.pd_type}
                      </span>
                    )}
                  </div>

                  {/* Account Information Details */}
                  <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5 border-b border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Account Number
                      </span>
                      <span className="mt-0.5 text-sm font-mono font-bold text-[#101828]">
                        {accInfo?.account_number || "—"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Product Type
                      </span>
                      <span className="mt-0.5 text-sm font-medium text-[#101828]">
                        {accInfo?.product_type || "—"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        PD Classification
                      </span>
                      <span className="mt-0.5 text-sm font-bold text-[#E11D48]">
                        {accInfo?.pd_type || "—"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Principal Release
                      </span>
                      <span className="mt-0.5 text-sm font-bold text-[#101828]">
                        {accInfo?.formatted_principal_release ||
                          (accInfo?.principal_release != null
                            ? `₱ ${accInfo.principal_release.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : "—")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Outstanding Balance
                      </span>
                      <span className="mt-0.5 text-sm font-bold text-[#101828]">
                        {accInfo?.formatted_outstanding_balance ||
                          (accInfo?.outstanding_balance != null
                            ? `₱ ${accInfo.outstanding_balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : "—")}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Date Released
                      </span>
                      <span className="mt-0.5 text-sm font-medium text-[#101828]">
                        {formatDisplayDate(
                          accInfo?.date_release || accInfo?.date_released,
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#667085]">
                        Maturity Date
                      </span>
                      <span className="mt-0.5 text-sm font-medium text-[#101828]">
                        {formatDisplayDate(accInfo?.maturity_date)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:col-span-2">
                      <span className="text-xs text-[#667085]">
                        Date & Time
                      </span>
                      <span className="mt-0.5 text-sm font-medium text-[#101828]">
                        {accInfo?.date_and_time || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Arrears & Delinquency Details */}
                  <div className="bg-[#FAFBFD] p-4 sm:p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#475467] mb-3">
                      Arrears & Delinquency Status
                    </h4>
                    <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 sm:grid-cols-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          Start Arrears
                        </span>
                        <span className="mt-0.5 text-sm font-bold text-[#101828]">
                          {formatDisplayDate(arrears?.start_arrears)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          Days of Arrears
                        </span>
                        <span className="mt-0.5 text-sm font-bold text-[#E11D48]">
                          {arrears?.formatted_days_of_arrears ||
                            (arrears?.days_of_arrears != null
                              ? String(arrears.days_of_arrears)
                              : "—")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          PAR Amount
                        </span>
                        <span className="mt-0.5 text-sm font-bold text-[#E11D48]">
                          {arrears?.formatted_par_amount ||
                            (arrears?.par_amount != null
                              ? `₱ ${arrears.par_amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : "—")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          Default Principal
                        </span>
                        <span className="mt-0.5 text-sm font-bold text-[#101828]">
                          {arrears?.formatted_default_principal ||
                            (arrears?.default_principal != null
                              ? `₱ ${arrears.default_principal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : "—")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          Default Interest
                        </span>
                        <span className="mt-0.5 text-sm font-bold text-[#101828]">
                          {arrears?.formatted_default_interest ||
                            (arrears?.default_interest != null
                              ? `₱ ${arrears.default_interest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : "—")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#667085]">
                          Date of Last Payment
                        </span>
                        <span className="mt-0.5 text-sm font-medium text-[#101828]">
                          {formatDisplayDate(arrears?.date_of_last_payment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback for Legacy Response Structure */
          <>
            <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
              <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
                  Account Information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">Account Number</span>
                  <span className="mt-0.5 text-sm font-bold font-mono text-[#101828]">
                    {legacyAccountInfo?.account_number ||
                      data.account_number ||
                      "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">Product Type</span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyAccountInfo?.product_type ||
                      data.product_type ||
                      "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">Date Released</span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {formatDisplayDate(
                      legacyAccountInfo?.date_release ||
                        legacyAccountInfo?.date_released ||
                        data.date_released,
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">Maturity Date</span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {formatDisplayDate(
                      legacyAccountInfo?.maturity_date || data.maturity_date,
                    )}
                  </span>
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <span className="text-xs text-[#667085]">Date & Time</span>
                  <span className="mt-0.5 text-sm font-medium text-[#101828]">
                    {legacyAccountInfo?.date_and_time || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5 overflow-hidden rounded-md border border-gray-200/90 bg-white">
              <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
                  Payment Details
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">
                    Principal Released
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyPrincipalBal?.formatted_principal_released ||
                      (legacyPrincipalBal?.principal_released != null
                        ? `₱ ${legacyPrincipalBal.principal_released.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">
                    Outstanding Principal
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyPrincipalBal?.formatted_outstanding_principal ||
                      (legacyPrincipalBal?.outstanding_principal != null
                        ? `₱ ${legacyPrincipalBal.outstanding_principal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">
                    Date of Last Payment
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {formatDisplayDate(legacyArrears?.date_of_last_payment)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 overflow-hidden rounded-md border border-gray-200/90 bg-white">
              <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-gray-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#05512A]">
                  Delinquency & Arrears Details
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-3 sm:p-5">
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">Start Arrears</span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {formatDisplayDate(legacyArrears?.start_arrears)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">
                    Days of Arrears
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyArrears?.formatted_days_of_arrears ||
                      (legacyArrears?.days_of_arrears != null
                        ? String(legacyArrears.days_of_arrears)
                        : "—")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">PAR Amount</span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyArrears?.formatted_par_amount ||
                      (legacyArrears?.par_amount != null
                        ? `₱ ${legacyArrears.par_amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#667085]">
                    Default Principal
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyArrears?.formatted_default_principal ||
                      (legacyArrears?.default_principal != null
                        ? `₱ ${legacyArrears.default_principal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—")}
                  </span>
                </div>
                <div className="flex flex-col sm:col-span-2">
                  <span className="text-xs text-[#667085]">
                    Default Interest
                  </span>
                  <span className="mt-0.5 text-sm font-bold text-[#101828]">
                    {legacyArrears?.formatted_default_interest ||
                      (legacyArrears?.default_interest != null
                        ? `₱ ${legacyArrears.default_interest.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
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
