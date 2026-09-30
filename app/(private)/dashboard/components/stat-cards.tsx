"use client";

import { fetchSummaryCardsApi } from "@/services/api-manager/dashboard/fetch-summary/fetch-summary-api";
import { FetchSummaryTypeData } from "@/services/api-manager/dashboard/fetch-summary/fetch-summery-type";
import { useState, useEffect, useCallback } from "react";

interface StatCardsProps {
  data?: FetchSummaryTypeData;
}

export default function StatCards({ data: initialData }: StatCardsProps) {
  const [summary, setSummary] = useState<FetchSummaryTypeData | undefined>(
    initialData
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const response = await fetchSummaryCardsApi.fetchSummaryApi();
      if (response?.data) {
        setSummary(response.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch dashboard summary cards:", err);
      const errMsg =
        err instanceof Error ? err.message : "Failed to load summary data";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    loadSummary();
  };

  useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSummary();
    }
  }, [initialData, loadSummary]);

  const activeData = summary || initialData;

  const formatPeso = (formatted?: string, raw?: number) => {
    if (formatted != null && formatted !== "") {
      return formatted.startsWith("₱") ? formatted : `₱${formatted}`;
    }
    if (raw != null) {
      return `₱${raw.toLocaleString()}`;
    }
    return "—";
  };

  const stats = activeData
    ? [
        {
          title: activeData.outstanding_balance?.title || "Outstanding Balance",
          value: formatPeso(
            activeData.outstanding_balance?.formatted_outstanding_balance,
            activeData.outstanding_balance?.total_outstanding_balance
          ),
        },
        {
          title: activeData.par_rate?.title || "PAR Rate",
          value:
            activeData.par_rate?.formatted_par_rate ??
            (activeData.par_rate?.par_rate != null
              ? `${activeData.par_rate.par_rate}%`
              : "—"),
        },
        {
          title:
            activeData.total_active_clients?.title || "Total Active Clients",
          value:
            activeData.total_active_clients?.formatted_total_clients ??
            (activeData.total_active_clients?.total_clients != null
              ? activeData.total_active_clients.total_clients.toString()
              : "—"),
        },
        {
          title:
            activeData.total_amount_of_past_due_account?.title ||
            "Total Amount of Past Due Account",
          value: formatPeso(
            activeData.total_amount_of_past_due_account
              ?.formatted_total_past_due,
            activeData.total_amount_of_past_due_account?.total_past_due
          ),
        },
        {
          title:
            activeData.total_amount_release_for_the_month?.title ||
            "Total Amount Release for the Month",
          value: formatPeso(
            activeData.total_amount_release_for_the_month
              ?.formatted_total_amount_release,
            activeData.total_amount_release_for_the_month?.total_amount_release
          ),
        },
      ]
    : [];

  return (
    <div className="space-y-2">
      {error && !activeData && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="underline font-medium hover:text-red-900 cursor-pointer ml-2"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading && !activeData
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-xs rounded-md border border-gray-200/70 p-5 flex flex-col justify-between animate-pulse h-28"
              >
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white shadow-xs rounded-md border border-gray-200/70 shadow-cloud-card hover:shadow-cloud-card-hover transition-all p-5 flex flex-col justify-between"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A3A2A2] leading-tight">
                  {stat.title}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-[#1E6E25]">
                  {stat.value}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
