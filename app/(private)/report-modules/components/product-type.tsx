"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { productTypeApi } from "@/services/api-manager/reports/product-type/product-type-api";
import {
  ProductTypeRecord,
  ProductTypeTotal,
} from "@/services/api-manager/reports/product-type/product-type-type";
import { ApiError } from "@/services/api-manager/baseApiEndpoint";

const formatCurrency = (val?: number | null, fallbackFormatted?: string) => {
  if (fallbackFormatted) {
    return fallbackFormatted.startsWith("₱")
      ? fallbackFormatted
      : `₱ ${fallbackFormatted}`;
  }
  if (val != null && !isNaN(val)) {
    return `₱ ${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return "₱ 0.00";
};

export default function ProductTypePage() {
  const [productTypes, setProductTypes] = useState<ProductTypeRecord[]>([]);
  const [total, setTotal] = useState<ProductTypeTotal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await productTypeApi.fetchProductTypeReport();

        if (response?.retCode === "200" && response.data?.records) {
          setProductTypes(response.data.records);
          if (response.data.total) {
            setTotal(response.data.total);
          }
          if (response.data.records.length === 0) {
            setNoDataMessage({
              title: "No Data Available",
              subtitle: "There are no records to display at this time.",
            });
          } else {
            setNoDataMessage(null);
          }
        } else {
          setProductTypes([]);
          setTotal(null);
          setNoDataMessage({
            title: response?.message || "No Data Available",
            subtitle:
              response?.data?.message ||
              "There are no records to display at this time.",
          });
        }
      } catch (err: unknown) {
        setProductTypes([]);
        setTotal(null);

        if (err instanceof ApiError) {
          const errorData = err.data as
            | { message?: string }
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
        } else {
          setNoDataMessage({
            title: "No Data Available",
            subtitle: "There are no records to display at this time.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProductTypes = useMemo(() => {
    if (!searchQuery.trim()) return productTypes;
    const q = searchQuery.toLowerCase();
    return productTypes.filter((item) =>
      item.product_type.toLowerCase().includes(q),
    );
  }, [productTypes, searchQuery]);

  const isFiltered = searchQuery.trim().length > 0;

  const totalNoOfAcc = useMemo(() => {
    if (!isFiltered && total?.no_of_accounts != null) {
      return total.no_of_accounts;
    }
    return filteredProductTypes.reduce(
      (acc, r) => acc + (r.no_of_accounts || 0),
      0,
    );
  }, [filteredProductTypes, isFiltered, total]);

  const totalAmountGranted = useMemo(() => {
    if (!isFiltered && total?.original_amount_granted != null) {
      return total.original_amount_granted;
    }
    return filteredProductTypes.reduce(
      (acc, r) => acc + (r.original_amount_granted || 0),
      0,
    );
  }, [filteredProductTypes, isFiltered, total]);

  const totalOutstandingBalance = useMemo(() => {
    if (!isFiltered && total?.outstanding_balance != null) {
      return total.outstanding_balance;
    }
    return filteredProductTypes.reduce(
      (acc, r) => acc + (r.outstanding_balance || 0),
      0,
    );
  }, [filteredProductTypes, isFiltered, total]);

  return (
    <div>
      {/* Top Header & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-72 sm:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search product types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
          />
          {isLoading && (
            <Loader2
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
            />
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto min-h-75">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8F9FA] text-[#475467] text-xs font-semibold">
                <th className="whitespace-nowrap px-4 py-3.5 text-left first:rounded-l-md">
                  Product Type
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  No. of Accounts
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">
                  Original Amount Granted
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right last:rounded-r-md">
                  Outstanding Balance
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {isLoading && productTypes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2
                        size={36}
                        className="animate-spin text-[#1E6E25] mb-3"
                      />
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Loading product types...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredProductTypes.length > 0 ? (
                filteredProductTypes.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-xs sm:text-sm font-bold text-[#191924]">
                        {item.product_type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-semibold text-[#191924]">
                      {item.no_of_accounts.toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-bold text-[#191924]">
                      {formatCurrency(
                        item.original_amount_granted,
                        item.formatted_original_amount_granted,
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-xs sm:text-sm font-bold text-[#191924]">
                      {formatCurrency(
                        item.outstanding_balance,
                        item.formatted_outstanding_balance,
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                /* 404 / No Data Available State */
                <tr>
                  <td colSpan={4} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <div className="mb-5 flex items-center justify-center text-[#CBD5E1]">
                        <svg
                          className="w-14.5 h-18"
                          viewBox="0 0 64 76"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M40 6H16C11.5 6 8 9.5 8 14V62C8 66.5 11.5 70 16 70H48C52.5 70 56 66.5 56 62V22L40 6Z" />
                          <path d="M40 6V20C40 21.1 40.9 22 42 22H56" />
                          <line
                            x1="24"
                            y1="46"
                            x2="40"
                            y2="46"
                            strokeWidth="4.5"
                          />
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
                  </td>
                </tr>
              )}
            </tbody>

            {/* Summary Footer */}
            {filteredProductTypes.length > 0 && (
              <tfoot className="border-t border-gray-200 bg-[#F8F9FA]/60">
                <tr className="text-xs font-bold text-[#191924]">
                  <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold first:rounded-bl-xl">
                    Total
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold">
                    {totalNoOfAcc.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold">
                    {formatCurrency(
                      totalAmountGranted,
                      !isFiltered
                        ? total?.formatted_original_amount_granted
                        : undefined,
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold last:rounded-br-xl">
                    {formatCurrency(
                      totalOutstandingBalance,
                      !isFiltered
                        ? total?.formatted_outstanding_balance
                        : undefined,
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
