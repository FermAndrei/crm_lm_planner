"use client";

import { getProductType } from "@/services/reports/all-loan.services";
import { ProductType } from "@/services/types/product-type/product-type";
import { useEffect, useState } from "react";

const formatCurrency = (val: number) => {
  if (val === 0) return "0";

  return val.toLocaleString("en-US", {
    minimumFractionDigits: val % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

export default function ProductTypePage() {
  const [productType, setProductType] = useState<ProductType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProductType();
        setProductType(response.productType);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }

    fetchData();
  }, []);

  const totalNoOfAcc = productType.reduce((acc, r) => acc + r.noOfAccount, 0);

  const totalAmountGranted = productType.reduce(
    (acc, r) => acc + r.originalAmountGranted,
    0,
  );

  const totalOutstandingBalance = productType.reduce(
    (acc, r) => acc + r.outstandingBalance,
    0,
  );

  return (
    <div className="overflow-hidden">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5a5a70] bg-[#FAF9FD] px-3.5 py-1.5 rounded-full border border-[#191924]/8 shadow-xs">
            {productType.length} Product Classifications
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#191924]/8 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#05512A] text-white">
            <tr className="bg-[#05512A] text-white">
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider">
                Product Type
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                No. of Accounts
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Original Amount Granted
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider">
                Outstanding Balance
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1EEF8]">
            {productType.length > 0 ? (
              productType.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-xs sm:text-sm font-bold text-[#191924]">
                      {item.prodType}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs sm:text-sm font-semibold text-[#191924]">
                    {formatCurrency(item.noOfAccount)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs sm:text-sm font-bold text-[#191924]">
                    ₱ {formatCurrency(item.originalAmountGranted)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-xs sm:text-sm font-extrabold text-[#191924]">
                    ₱ {formatCurrency(item.outstandingBalance)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-xs font-medium text-[#5a5a70]"
                >
                  No product type data available.
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer */}
          <tfoot className="border-t-2 border-[#191924]/10 bg-[#D2E7C4]">
            <tr className="text-xs font-extrabold text-[#191924]">
              <td className="px-4 py-3.5 uppercase tracking-wider font-extrabold">
                TOTAL
              </td>

              <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-sm font-extrabold">
                {formatCurrency(totalNoOfAcc)}
              </td>

              <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-sm font-extrabold">
                ₱ {formatCurrency(totalAmountGranted)}
              </td>

              <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono text-sm font-extrabold">
                ₱ {formatCurrency(totalOutstandingBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
