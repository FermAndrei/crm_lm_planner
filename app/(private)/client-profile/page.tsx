"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClientData {
  cid: string;
  clientClassification: string;
  clientType: string;
  dateRecognized: string;
  mobileNo: string;
  dateOfBirth: string;
  governmentId: string;
  emailAddress: string;
  registeredAddress: string;
  status: string;

  activeLoanType: string;
  totalPrincipalReleased: string;
  registeredCollateral: string;
  outstandingPrincipalBalance: string;
}

const mockClients: ClientData[] = [
  {
    cid: "CID-2020-001-001",
    clientClassification: "Individual",
    clientType: "Borrower",
    dateRecognized: "03/15/2020",
    mobileNo: "+63 912 345 6789",
    dateOfBirth: "05/22/1985",
    governmentId: "SSS-12-3456789-0",
    emailAddress: "juan.delacruz@email.com",
    registeredAddress: "Purok 5, Brgy. San Jose, Panabo City, Davao del Norte",
    status: "Active",
    activeLoanType: "Business Loan (BizLoan)",
    totalPrincipalReleased: "₱ 500,000.00",
    registeredCollateral: "Real Estate Property",
    outstandingPrincipalBalance: "₱ 350,000.00",
  },
  {
    cid: "CID-2021-002-002",
    clientClassification: "Individual",
    clientType: "Borrower",
    dateRecognized: "07/10/2021",
    mobileNo: "+63 917 456 7890",
    dateOfBirth: "11/08/1990",
    governmentId: "UMID-02-9876543-1",
    emailAddress: "maria.santos@email.com",
    registeredAddress: "Purok 2, Brgy. Mabuhay, Tagum City, Davao del Norte",
    status: "Active",

    activeLoanType: "Agricultural Loan",
    totalPrincipalReleased: "₱ 300,000.00",
    registeredCollateral: "Agricultural Land",
    outstandingPrincipalBalance: "₱ 185,000.00",
  },
  {
    cid: "CID-2022-003-003",
    clientClassification: "Individual",
    clientType: "Borrower",
    dateRecognized: "01/25/2022",
    mobileNo: "+63 905 789 0123",
    dateOfBirth: "09/17/1988",
    governmentId: "PhilSys-03-456789012",
    emailAddress: "pedro.reyes@email.com",
    registeredAddress: "Purok 8, Brgy. San Isidro, Carmen, Davao del Norte",
    status: "Active",

    activeLoanType: "Personal Loan",
    totalPrincipalReleased: "₱ 150,000.00",
    registeredCollateral: "Motor Vehicle",
    outstandingPrincipalBalance: "₱ 75,000.00",
  },
];

const ClientProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSelectedClient(null);
      return;
    }

    const client = mockClients.find((item) =>
      item.cid.toLowerCase().includes(query),
    );

    setSelectedClient(client ?? null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div
        className={cn(
          "p-8 flex flex-col lg:flex-row gap-4",
          !selectedClient ? "h-full" : "h-fit",
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
                placeholder="CID-XXXX-XXXX-XXX"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-md border border-gray-200/90 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#05512A] focus:outline-none focus:ring-1 focus:ring-[#05512A] shadow-xs transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#1E6E25] flex text-white items-center justify-center gap-2 px-3.5 py-2.5 text-xs w-full rounded-md"
          >
            <Search className="h-3 w-3" />
            Search
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

          {!selectedClient ? (
            /* No Client Selected */
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-[#F4F9F5] text-[#1E6E25] p-6 mb-5">
                  <Search size={42} strokeWidth={1.8} />
                </div>

                <p className="text-xl font-semibold text-[#333333]">
                  No Client Selected
                </p>

                <p className="mt-2 max-w-150 text-[13px] text-[#7A7A7A]">
                  Search for a client using their CID number to view their
                  profile and loan information.
                </p>
              </div>
            </div>
          ) : (
            /* Client Information */
            <>
              <div className="flex justify-between border-b-2 items-center">
                <p className="text-[#1E6E25] text-base font-semibold mb-4">
                  Personal & Account Details
                </p>

                <span className="inline-block rounded-full px-3 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D]">
                  {selectedClient.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Client Classification
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                      {selectedClient.clientClassification}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      CID
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                      {selectedClient.cid}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Client Type
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.clientType}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Date Recognize
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.dateRecognized}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Mobile No.
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.mobileNo}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Date of Birth
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.dateOfBirth}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Government ID
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.governmentId}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Email Address
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.emailAddress}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Registered Address
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.registeredAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between border-b-2">
                <p className="text-[#1E6E25] text-base font-semibold mb-4">
                  Loan Portfolio Summary
                </p>
              </div>

              <div className="mb-5">
                <div className="grid grid-cols-1 gap-y-3.5 gap-x-8 p-4 sm:grid-cols-2 sm:p-5">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Active Loan Type
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828] uppercase">
                      {selectedClient.activeLoanType}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Total Principal Released
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.totalPrincipalReleased}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Registered Collateral
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#101828]">
                      {selectedClient.registeredCollateral}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-[#667085] uppercase">
                      Outstanding Principal Balance
                    </span>

                    <span className="mt-0.5 text-sm font-bold text-[#1E6E25]">
                      {selectedClient.outstandingPrincipalBalance}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientProfilePage;
