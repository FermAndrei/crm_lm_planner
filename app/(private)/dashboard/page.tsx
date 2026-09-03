"use client";
import { LoanReleases } from "@/app/(private)/dashboard/components/loan-releases";
import { ChartLineLinear } from "@/app/(private)/dashboard/components/line-chart";
import { ChartPieSimple } from "@/app/(private)/dashboard/components/pie";
import { PerLoanProduct } from "@/app/(private)/dashboard/components/per-loan-product";
import StatCards from "./components/stat-cards";
import { Layout } from "lucide-react";
import DateAndTime from "@/components/ui/date-time";

export default function Page() {
  return (
    <>
      <div className="p-4 md:p-6 space-y-4 ">
        <header className="flex shrink-0 items-center border-b-2  border-[#8a9b8c1d] gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#bbefe9] rounded-lg text-[#2e4a3f]">
              <Layout size={20} />
            </div>
            <h1 className="text-[#1E4637] text-4xl uppercase font-bold tracking-tight ">
              Loan Manager's Portfolio
            </h1>
          </div>
        </header>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-700">
            All Branch Loan Account
          </h2>
          <div>
            <DateAndTime />
          </div>
        </div>
        <StatCards />
        <div className="flex flex-1 flex-col gap-4 mt-4 pt-0">
          <div className="grid items-stretch gap-4 grid-cols-1 lg:grid-cols-15">
            <div className="col-span-15 h-110 md:col-span-8">
              <LoanReleases />
            </div>
            <div className="col-span-15 h-110 md:col-span-7">
              <PerLoanProduct />
            </div>
          </div>
          <div className="grid items-stretch gap-4 grid-cols-1 lg:grid-cols-15">
            <div className="col-span-15 md:col-span-5">
              <ChartPieSimple />
            </div>
            <div className="col-span-15 md:col-span-10">
              <ChartLineLinear />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
