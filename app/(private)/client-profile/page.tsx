"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError } from "@/services/api-manager/baseApiEndpoint";
import { clientProfileApi } from "@/services/api-manager/client-profile/client-profile-api";
import {
  ClientProfileData,
  ClientProfileErrorData,
} from "@/services/api-manager/client-profile/client-profile-type";

const formatCurrency = (amount?: number | null, fallbackFormatted?: string) => {
  if (typeof amount === "number" && !isNaN(amount)) {
    return `₱ ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (fallbackFormatted) {
    return fallbackFormatted.startsWith("₱")
      ? fallbackFormatted
      : `₱ ${fallbackFormatted}`;
  }
  return "-";
};

const ClientProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientData, setClientData] = useState<ClientProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setClientData(null);
      setNoDataMessage({
        title: "No Data Available",
        subtitle: "There are no records to display at this time.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await clientProfileApi.fetchClientInformation({
        client_id: query,
      });

      if (
        response?.retCode === "200" &&
        response.data &&
        !("message" in response.data && Object.keys(response.data).length === 1)
      ) {
        setClientData(response.data as ClientProfileData);
        setNoDataMessage(null);
      } else {
        setClientData(null);
        const errorData = response?.data as ClientProfileErrorData | undefined;
        setNoDataMessage({
          title: response?.message || "No Data Available",
          subtitle:
            errorData?.message ||
            "There are no records to display at this time.",
        });
      }
    } catch (err: unknown) {
      setClientData(null);

      if (err instanceof ApiError) {
        const errorData = err.data as
          | ClientProfileErrorData
          | string
          | undefined;
        const subMsg =
          typeof errorData === "object" && errorData && "message" in errorData
            ? errorData.message
            : typeof errorData === "string"
              ? errorData
              : undefined;

        setNoDataMessage({
          title: err.message || "No Data Available",
          subtitle: subMsg || "There are no records to display at this time.",
        });
      } else if (err instanceof Error) {
        let title = "No Data Available";
        let subtitle = "There are no records to display at this time.";

        try {
          const jsonStart = err.message.indexOf("{");
          if (jsonStart !== -1) {
            const parsed = JSON.parse(err.message.slice(jsonStart));
            if (parsed.message) title = parsed.message;
            if (parsed.data?.message) subtitle = parsed.data.message;
          } else if (
            err.message &&
            !err.message.toLowerCase().includes("failed")
          ) {
            subtitle = err.message;
          }
        } catch {
          if (err.message && !err.message.toLowerCase().includes("failed")) {
            subtitle = err.message;
          }
        }

        setNoDataMessage({ title, subtitle });
      } else {
        setNoDataMessage({
          title: "No Data Available",
          subtitle: "There are no records to display at this time.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const personalDetails = clientData?.personal_and_account_details;

  return (
    <>
      <div
        className={cn(
          "p-8 flex flex-col lg:flex-row gap-4",
          !clientData && !isLoading ? "h-full" : "h-fit",
        )}
      >
        {/* Client Search */}
        <div className="col-span-1 bg-white p-6 lg:w-112.5 rounded-md h-fit shadow">
          <div className="mb-3">
            <h1 className="text-[#1E6E25] font-semibold text-base">
              Client Search
            </h1>
            <p className="text-[#7A7A7A] text-xs">
              Enter the Client CID to view profile and loan details.
            </p>
          </div>

          <div className="mb-3">
            <h2 className="text-[#7A7A7A] text-xs mb-1">Client CID</h2>

            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                disabled={isLoading}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-[#1E6E25] hover:bg-[#18581e] disabled:opacity-60 disabled:cursor-not-allowed flex text-white items-center justify-center gap-2 px-3.5 py-2.5 text-xs w-full rounded-md transition-colors font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-3 w-3" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Client Profile Overview */}
        <div className="h-full w-full bg-white p-6 rounded-md shadow flex flex-col">
          <div className="mb-4">
            <h1 className="text-[#333333] font-bold text-2xl">
              Client Profile Overview
            </h1>

            <p className="text-[#7A7A7A] text-[14px]">
              Search client accounts and view loan allocation history.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-1 items-center justify-center min-h-[360px]">
              <div className="flex flex-col items-center text-center">
                <Loader2
                  size={42}
                  className="animate-spin text-[#1E6E25] mb-4"
                />
                <p className="text-base font-semibold text-[#333333]">
                  Fetching Client Profile...
                </p>
                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Retrieving personal details and loan portfolio records.
                </p>
              </div>
            </div>
          )}

          {/* Empty / No Data / Search Failed State (Image 1) */}
          {!isLoading && !clientData && (
            <div className="flex flex-1 items-center justify-center min-h-[360px] py-12">
              <div className="flex flex-col items-center text-center max-w-md px-4">
                {/* Document outline with folded dog-ear and minus pill */}
                <div className="mb-5 flex items-center justify-center text-[#CBD5E1]">
                  <svg
                    className="w-[58px] h-[72px]"
                    viewBox="0 0 64 76"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M40 6H16C11.5 6 8 9.5 8 14V62C8 66.5 11.5 70 16 70H48C52.5 70 56 66.5 56 62V22L40 6Z" />
                    <path d="M40 6V20C40 21.1 40.9 22 42 22H56" />
                    <line x1="24" y1="46" x2="40" y2="46" strokeWidth="4.5" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#333333]">
                  {noDataMessage?.title || "No Data Available"}
                </h3>

                <p className="mt-2 text-sm text-[#7A7A7A]">
                  {noDataMessage?.subtitle ||
                    "There are no records to display at this time."}
                </p>
              </div>
            </div>
          )}

          {/* Client Information Content */}
          {!isLoading && clientData && (
            <>
              {/* Personal & Account Details */}
              <div className="flex justify-between border-b-2 items-center pb-3">
                <p className="text-[#1E6E25] text-base font-semibold">
                  Personal & Account Details
                </p>

                {personalDetails?.client_type && (
                  <span className="inline-block rounded-full px-3 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D]">
                    {personalDetails.client_type}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Client Classification
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                      {personalDetails?.client_classification || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      CID
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                      {personalDetails?.client_id || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Client Type
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.client_type || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Date Recognize
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.date_recognized || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Mobile No.
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.mobile_no || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Date of Birth
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.date_of_birth || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Government ID
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.government || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Email Address
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.email_address || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-[#667085] uppercase">
                      Registered Address
                    </span>
                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {personalDetails?.registered_address || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Portfolio Summary Header */}
              <div className="flex flex-wrap items-center justify-between border-b-2 pb-3 mb-4 gap-2">
                <p className="text-[#1E6E25] text-base font-semibold">
                  Loan Portfolio Summary
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#667085] uppercase font-medium">
                      Active Loans:
                    </span>
                    <span className="font-bold text-[#101828] bg-gray-100 px-2 py-0.5 rounded">
                      {clientData.total_active_loans ??
                        clientData.loan_portfolio_profile?.length ??
                        0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#667085] uppercase font-medium">
                      Total Principal:
                    </span>
                    <span className="font-bold text-[#1E6E25]">
                      {formatCurrency(
                        clientData.total_principal,
                        clientData.formatted_total_principal,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Portfolio Items */}
              {clientData.loan_portfolio_profile &&
              clientData.loan_portfolio_profile.length > 0 ? (
                <div className="space-y-4">
                  {clientData.loan_portfolio_profile.map((loan, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200/90 bg-[#FAFAFA] p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 mb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#667085] uppercase bg-gray-200/70 px-2 py-0.5 rounded">
                            Loan #{idx + 1}
                          </span>
                          <span className="text-sm font-bold text-[#101828]">
                            {loan.active_loan_type || "Active Loan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#667085]">
                            Outstanding Balance:
                          </span>
                          <span className="text-sm font-bold text-[#1E6E25]">
                            {formatCurrency(
                              loan.total_outstanding_balance,
                              loan.formatted_total_outstanding_balance,
                            )}
                          </span>
                        </div>
                      </div>

                      {loan.records && loan.records.length > 0 ? (
                        <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 sm:grid-cols-2">
                          {loan.records.map((rec, rIdx) => (
                            <React.Fragment key={rIdx}>
                              <div className="flex flex-col">
                                <span className="text-xs text-[#667085] uppercase">
                                  Registered Collateral{" "}
                                  {loan.records && loan.records.length > 1
                                    ? `(${rIdx + 1})`
                                    : ""}
                                </span>
                                <span className="mt-0.5 text-sm font-semibold text-[#101828]">
                                  {rec.registered_collateral?.trim()
                                    ? rec.registered_collateral
                                    : "None"}
                                </span>
                              </div>

                              <div className="flex flex-col">
                                <span className="text-xs text-[#667085] uppercase">
                                  Principal Balance{" "}
                                  {loan.records && loan.records.length > 1
                                    ? `(${rIdx + 1})`
                                    : ""}
                                </span>
                                <span className="mt-0.5 text-sm font-bold text-[#1E6E25]">
                                  {formatCurrency(
                                    rec.outstanding_principal_balance,
                                    rec.formatted_outstanding_principal_balance,
                                  )}
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 sm:grid-cols-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-[#667085] uppercase">
                              Registered Collateral
                            </span>
                            <span className="mt-0.5 text-sm font-semibold text-[#101828]">
                              None
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs text-[#667085] uppercase">
                              Principal Balance
                            </span>
                            <span className="mt-0.5 text-sm font-bold text-[#1E6E25]">
                              {formatCurrency(
                                loan.total_outstanding_balance,
                                loan.formatted_total_outstanding_balance,
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-[#7A7A7A] bg-gray-50 rounded-md">
                  No active loan records found for this client.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientProfilePage;
