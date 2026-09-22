"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const ClientProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="p-8 grid grid-cols-4 gap-4 h-full">
        <div className="col-span-1 bg-white p-6 rounded-lg h-fit shadow">
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
                placeholder="CID-XXXX-XXXX-XXX"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full rounded-lg border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
              />
            </div>
          </div>
          <button className="bg-[#1E6E25] flex text-white items-center justify-center gap-2 px-3.5 py-2.5 text-xs w-full rounded-lg">
            <Search className="h-3 w-3" />
            Search
          </button>
        </div>

        {/* Client Profile Overview */}
        <div className="col-span-3 bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h1 className="text-[#333333] font-bold text-2xl">
              Client Profile Overview
            </h1>
            <p className="text-[#7A7A7A] text-[14px]">
              Search client accounts and view loan allocation history.
            </p>
          </div>

          <div className="flex-1 flex inset-0 items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-[#F4F9F5] text-[#1E6E25] p-6 mb-5">
                <Search size={42} strokeWidth={1.8} />
              </div>

              <p className="text-xl font-semibold text-[#333333]">
                No Client Selected
              </p>

              <p className="mt-2 max-w-[600px] text-[13px] text-[#7A7A7A]">
                Search for a client using their CID number to view their profile
                and loan information.
              </p>
            </div>
          </div>
          {/* <div className="flex justify-between border-b-2 items-center">
            <p className="text-[#1E6E25] text-base font-semibold mb-4">
              Personal & Account Details
            </p>
            <span className="inline-block rounded-full px-3 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D]">
              Active
            </span>
          </div>

          <div className="overflow-hidden mb-4">
            <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Client Classification
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                  Individual
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Client Type
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  Borrower
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Date Recognize
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  03/15/2020
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Mobile No.
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  +63 912 345 6789
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Date of Birth
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  05/22/1985
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Government ID
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  SSS-12-3456789-0
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Email Address
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  juan.delacruz@email.com
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Registered Address
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  Purok 5, Brgy. San Jose, Panabo City, Davao del Norte
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-b-2 ">
            <p className="text-[#1E6E25] text-base font-semibold mb-4">
              Loan Portfolio Summary
            </p>
          </div>

          <div className="mb-5 overflow-hidden">
            <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Active Loan Type
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                  Business Loan (BizLoan)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Total Principal Released
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  ₱ 500,000.00
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Registered Collateral
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#101828]">
                  Real Estate Property
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#667085] uppercase">
                  Outstanding Principal Balance
                </span>
                <span className="mt-0.5 text-sm font-bold text-[#1E6E25]">
                  ₱ 350,000.00
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ClientProfilePage;
