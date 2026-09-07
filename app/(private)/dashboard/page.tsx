"use client";
import { LoanReleases } from "@/app/(private)/dashboard/components/loan-releases";
import { ChartLineLinear } from "@/app/(private)/dashboard/components/line-chart";
import { ChartPieSimple } from "@/app/(private)/dashboard/components/pie";
import { PerLoanProduct } from "@/app/(private)/dashboard/components/per-loan-product";
import StatCards from "./components/stat-cards";
import { Layout } from "lucide-react";
import DateAndTime from "@/components/ui/date-time";

export default function DashBoard() {
  return (
    <>
      <div className="p-4 md:p-8 space-y-4">
        {/* Soft Cloud Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#191924]/8">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#bbefe9] rounded-2xl text-[#2e4a3f] shadow-cloud-pill">
              <Layout size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[#191924] text-2xl sm:text-3xl font-extrabold tracking-[-0.035em]">
                  Loan Manager&apos;s Portfolio
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#5a5a70] font-medium mt-0.5">
                Real-time loan disbursement analytics, PAR monitoring, and risk
                ratios across 12 branches.
              </p>
            </div>
          </div>
        </header>

        {/* Sub-Header Banner */}
        <div className="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-[#191924]/[0.07] shadow-cloud-card">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12946a] animate-pulse" />
            <h2 className="text-sm font-bold text-[#191924]">
              All Branch Portfolio Overview
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#5a5a70]">
            <DateAndTime />
          </div>
        </div>
        <StatCards />
        <div className="flex flex-1 flex-col gap-4 mt-4 pt-0">
          <div className="grid items-stretch gap-4 grid-cols-15">
            <div className="col-span-15 h-110 lg:col-span-8">
              <LoanReleases />
            </div>
            <div className="col-span-15 h-110 lg:col-span-7">
              <PerLoanProduct />
            </div>
          </div>
          <div className="grid items-stretch gap-4 grid-cols-15">
            <div className="col-span-15 lg:col-span-5">
              <ChartPieSimple />
            </div>
            <div className="col-span-15 lg:col-span-10">
              <ChartLineLinear />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
