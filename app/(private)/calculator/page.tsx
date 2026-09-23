"use client";

import React, { useState, useMemo } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CalculatorTab = "BizLoan" | "Manual" | "RCL-Agri";

interface NonDeductibleField {
  id: string;
  name: string;
  amount: string;
}

const TABS: CalculatorTab[] = ["BizLoan", "Manual", "RCL-Agri"];

const PAYMENT_MODES = [
  "Monthly",
  "Quarterly",
  "Semi-Annual",
  "Annual",
  "Lump Sum",
];

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("BizLoan");

  // Loan Details State
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [termMonths, setTermMonths] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [modeOfPayment, setModeOfPayment] = useState<string>("");
  const [incomeBasis, setIncomeBasis] = useState<string>("");

  // Deduction Expenses State
  const [lrf, setLrf] = useState<string>("");
  const [serviceFee, setServiceFee] = useState<string>("");
  const [docStampTax, setDocStampTax] = useState<string>("");
  const [appraisalFee, setAppraisalFee] = useState<string>("");
  const [mortgageFee, setMortgageFee] = useState<string>("");
  const [others, setOthers] = useState<string>("");

  // Non-deductible Expense State
  const [nonDeductibles, setNonDeductibles] = useState<NonDeductibleField[]>(
    [],
  );

  // Calculate or compute outputs
  const parseNum = (val: string): number => {
    const clean = val.replace(/[^0-9.-]+/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const formatCurrency = (val: number): string => {
    return `₱ ${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercent = (val: number): string => {
    return `${val.toFixed(2)}%`;
  };

  // Add non-deductible field
  const handleAddField = () => {
    const newField: NonDeductibleField = {
      id: `nd-${Date.now()}`,
      name: "",
      amount: "",
    };
    setNonDeductibles((prev) => [...prev, newField]);
  };

  const handleRemoveField = (id: string) => {
    setNonDeductibles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateField = (
    id: string,
    key: "name" | "amount",
    value: string,
  ) => {
    setNonDeductibles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  // Calculation Results
  const results = useMemo(() => {
    const principal = parseNum(loanAmount);
    const term = parseNum(termMonths);
    const annualRate = parseNum(interestRate);

    if (principal <= 0 || term <= 0 || annualRate <= 0) {
      // Return zeroed particulars
      const deductionTotal =
        parseNum(lrf) +
        parseNum(serviceFee) +
        parseNum(docStampTax) +
        parseNum(appraisalFee) +
        parseNum(mortgageFee) +
        parseNum(others);

      const nonDeductibleTotal = nonDeductibles.reduce(
        (sum, item) => sum + parseNum(item.amount),
        0,
      );

      const otherExpense = deductionTotal + nonDeductibleTotal;

      return {
        amortization: 0,
        monthlyEIR: 0,
        annualEIR: 0,
        monthlyContractual: 0,
        annualContractual: 0,
        addOnRate: 0,
        totalInterest: 0,
        otherExpense,
      };
    }

    // Monthly contractual rate
    const monthlyContractual = annualRate / 12;
    const annualContractual = annualRate;

    // Standard Amortization: A = P * [r(1+r)^n] / [(1+r)^n - 1]
    const r = annualRate / 100 / 12;
    let amortization = 0;
    let totalInterest = 0;

    if (r > 0) {
      const pow = Math.pow(1 + r, term);
      amortization = (principal * (r * pow)) / (pow - 1);
      totalInterest = amortization * term - principal;
    } else {
      amortization = principal / term;
      totalInterest = 0;
    }

    // Effective Interest Rates
    const monthlyEIR = monthlyContractual;
    const annualEIR = (Math.pow(1 + r, 12) - 1) * 100;

    // Add-on Interest Rate: Total Interest / Principal / (Term / 12) * 100
    const addOnRate =
      term > 0 ? (totalInterest / principal / (term / 12)) * 100 : 0;

    // Sum of expenses
    const deductionTotal =
      parseNum(lrf) +
      parseNum(serviceFee) +
      parseNum(docStampTax) +
      parseNum(appraisalFee) +
      parseNum(mortgageFee) +
      parseNum(others);

    const nonDeductibleTotal = nonDeductibles.reduce(
      (sum, item) => sum + parseNum(item.amount),
      0,
    );

    const otherExpense = deductionTotal + nonDeductibleTotal;

    return {
      amortization,
      monthlyEIR,
      annualEIR,
      monthlyContractual,
      annualContractual,
      addOnRate,
      totalInterest,
      otherExpense,
    };
  }, [
    loanAmount,
    termMonths,
    interestRate,
    lrf,
    serviceFee,
    docStampTax,
    appraisalFee,
    mortgageFee,
    others,
    nonDeductibles,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculations update reactively, submit provides feedback
  };

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Top Segment Control */}
      <div className="bg-white p-1 rounded-md flex items-center w-fit shado">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "cursor-pointer rounded-md px-6 py-1.5 text-xs sm:text-sm font-medium transition-all",
                isActive
                  ? "bg-[#05512A] font-semibold text-white shadow-xs"
                  : "text-[#666666] hover:text-[#191924]",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#191924] tracking-tight">
        Interest Template ({activeTab})
      </h1>

      {/* Main Grid: Form Card on Left & Particulars Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Card */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-md p-6 sm:p-8 shadow-xs border border-gray-200/70 space-y-6"
        >
          {/* Section: Loan Details */}
          <div>
            <h2 className="text-[#05512A] font-bold text-sm sm:text-base mb-4">
              Loan Details
            </h2>

            <div className="space-y-4">
              {/* Row 1: Loan Amount & Term (Months) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Loan Amount
                  </label>
                  <input
                    type="text"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Enter loan amount"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Term (Months)
                  </label>
                  <input
                    type="text"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    placeholder="Enter term"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Interest (%) & Mode of Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Interest (%)
                  </label>
                  <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Mode of Payment
                  </label>
                  <div className="relative">
                    <select
                      value={modeOfPayment}
                      onChange={(e) => setModeOfPayment(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white pr-9"
                    >
                      <option value="">Select mode of payment</option>
                      {PAYMENT_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 3: Income Basis */}
              <div>
                <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                  Income Basis
                </label>
                <input
                  type="text"
                  value={incomeBasis}
                  onChange={(e) => setIncomeBasis(e.target.value)}
                  placeholder="Enter income basis"
                  className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section: Deduction Expenses */}
          <div className="pt-2">
            <h2 className="text-[#05512A] font-bold text-sm sm:text-base mb-4">
              Deduction Expenses
            </h2>

            <div className="space-y-4">
              {/* Row 1: Loan Redemption Fund & Service Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Loan Redemption Fund
                  </label>
                  <input
                    type="text"
                    value={lrf}
                    onChange={(e) => setLrf(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Service Fee
                  </label>
                  <input
                    type="text"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Documentary Stamp Tax & Appraisal Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Documentary Stamp Tax
                  </label>
                  <input
                    type="text"
                    value={docStampTax}
                    onChange={(e) => setDocStampTax(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Appraisal Fee
                  </label>
                  <input
                    type="text"
                    value={appraisalFee}
                    onChange={(e) => setAppraisalFee(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Mortgage Fee & Others */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Mortgage Fee
                  </label>
                  <input
                    type="text"
                    value={mortgageFee}
                    onChange={(e) => setMortgageFee(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#191924] mb-1.5 block">
                    Others
                  </label>
                  <input
                    type="text"
                    value={others}
                    onChange={(e) => setOthers(e.target.value)}
                    placeholder="₱ 0.00"
                    className="w-full rounded-md border border-gray-200/90 px-3.5 py-2.5 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Non-deductible Expense */}
          <div className="pt-2 space-y-3">
            <h2 className="text-[#05512A] font-bold text-sm sm:text-base">
              Non-deductible Expense
            </h2>

            {/* Dynamic Non-deductible rows if any */}
            {nonDeductibles.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateField(item.id, "name", e.target.value)
                  }
                  placeholder="Expense name"
                  className="flex-1 rounded-md border border-gray-200/90 px-3.5 py-2 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) =>
                    handleUpdateField(item.id, "amount", e.target.value)
                  }
                  placeholder="₱ 0.00"
                  className="w-36 sm:w-44 rounded-md border border-gray-200/90 px-3.5 py-2 text-sm text-[#191924] placeholder:text-gray-400 focus:outline-none focus:border-[#05512A] focus:ring-1 focus:ring-[#05512A] transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddField}
              className="px-4 py-1.5 rounded-md border border-[#05512A] text-[#05512A] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#05512A] hover:bg-[#044423] text-white font-bold rounded-md shadow-xs transition-all uppercase tracking-wider text-sm cursor-pointer"
            >
              SUBMIT
            </button>
          </div>
        </form>

        {/* Right Particulars Card */}
        <div className="lg:col-span-5 bg-white rounded-md p-6 sm:p-8 shadow-sm border border-gray-200/70 space-y-6">
          <h2 className="text-[#05512A] font-bold text-sm sm:text-base">
            Particulars
          </h2>

          <div className="space-y-4 divide-y divide-gray-100">
            {/* Amortization */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Amortization
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatCurrency(results.amortization)}
              </span>
            </div>

            {/* Monthly Effective Interest Rate */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Monthly Effective Interest Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatPercent(results.monthlyEIR)}
              </span>
            </div>

            {/* Annual Effective Interest Rate */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Annual Effective Interest Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatPercent(results.annualEIR)}
              </span>
            </div>

            {/* Monthly Contractual Rate */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Monthly Contractual Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatPercent(results.monthlyContractual)}
              </span>
            </div>

            {/* Annual Contractual Rate */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Annual Contractual Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatPercent(results.annualContractual)}
              </span>
            </div>

            {/* Add-on Interest Rate */}
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Add-on Interest Rate
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#191924]">
                {formatPercent(results.addOnRate)}
              </span>
            </div>
          </div>

          {/* Prominent Highlight: Total Interest Amount */}
          <div className="pt-6 border-t border-gray-200/80 flex items-baseline justify-between gap-4">
            <span className="text-lg sm:text-xl font-bold text-[#191924]">
              Total Interest Amount
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#05512A]">
              {formatCurrency(results.totalInterest)}
            </span>
          </div>

          {/* Other Expense */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              Other Expense
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#191924]">
              {formatCurrency(results.otherExpense)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
