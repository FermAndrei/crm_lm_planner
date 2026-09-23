"use client";
import { LoanReleases } from "@/app/(private)/dashboard/components/loan-releases";
import { ChartLineLinear } from "@/app/(private)/dashboard/components/outstanding-balance";
import { ChartPieSimple } from "@/app/(private)/dashboard/components/past-due";
import { PerLoanProduct } from "@/app/(private)/dashboard/components/per-loan-product";
import StatCards from "./components/stat-cards";

export default function DashBoard() {
  return (
    <>
      <div className="p-4 md:p-8 space-y-4">
        {/* Soft Cloud Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[#262626] text-xl sm:text-3xl font-extrabold tracking-[-0.035em]">
                  Loan Manager&apos;s Portfolio
                </h1>
              </div>
              <p className="text-[13px] sm:text-sm text-[#737373] font-medium mt-0.5">
                LM Planner provides real-time analytics and summary views for
                handle units, centers, and client statuses in one place.
              </p>
            </div>
          </div>
        </header>

        {/* Sub-Header Banner */}
        <StatCards />
        <div className="flex flex-1 flex-col gap-4 mt-4 pt-0">
          <div className="grid items-stretch gap-4 grid-cols-15">
            <div className="col-span-15 h-110 min-[1260px]:col-span-8">
              <LoanReleases />
            </div>
            <div className="col-span-15 h-110 min-[1260px]:col-span-7">
              <PerLoanProduct />
            </div>
          </div>
          <div className="grid items-stretch gap-4 grid-cols-15">
            <div className="col-span-15 min-[1260px]:col-span-6 ">
              <ChartPieSimple />
            </div>
            <div className="col-span-15 min-[1260px]:col-span-9 ">
              <ChartLineLinear />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
