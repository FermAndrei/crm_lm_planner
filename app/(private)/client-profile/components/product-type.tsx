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
    <div className="w-300 mx-auto overflow-hidden rounded-xl border border-gray-200 mt-4 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-700">Product Type</h2>
          <p className="mt-1 text-sm font-medium text-gray-400">
            Summary of accounts by product type
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-175 border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200  bg-[#05512A] text-white text-[13px] font-semibold uppercase tracking-wide">
              <th className="whitespace-nowrap px-5 py-3 rounded-tl-lg">
                Product Type
              </th>

              <th className="whitespace-nowrap px-5 py-3 text-right">
                No. of Account
              </th>

              <th className="whitespace-nowrap px-5 py-3 text-right">
                Original Amount Granted
              </th>

              <th className="whitespace-nowrap px-5 py-3 text-right rounded-tr-lg">
                Outstanding Balance
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 border">
            {productType.length > 0 ? (
              productType.map((item, index) => (
                <tr
                  key={index}
                  className="group transition-colors hover:bg-emerald-50/40"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-800">
                        {item.prodType}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-medium text-gray-700">
                    {formatCurrency(item.noOfAccount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-medium text-gray-700">
                    ₱ {formatCurrency(item.originalAmountGranted)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-semibold text-[#1D4D3E]">
                    ₱ {formatCurrency(item.outstandingBalance)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-sm text-gray-500"
                >
                  No product type data available.
                </td>
              </tr>
            )}
          </tbody>

          {/* Footer */}
          <tfoot>
            <tr className="border-t-2 border-[#1D4D3E] bg-[#D2E7C4] text-sm font-bold text-[#1D4D3E]">
              <td className="px-5 py-4 rounded-bl-lg">
                <span className="text-xs font-black uppercase tracking-wide ">
                  Total
                </span>
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right font-black ">
                {formatCurrency(totalNoOfAcc)}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right font-black">
                ₱ {formatCurrency(totalAmountGranted)}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-right font-black rounded-br-lg">
                ₱ {formatCurrency(totalOutstandingBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
