"use client";

import React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartPie } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type LoanProductBreakdown = {
  id: number;
  productName: string;
  clientCount: number;
  percentage: number;
  // amountFormatted: string;
  color: string;
  value: number;
};

const chartData: LoanProductBreakdown[] = [
  {
    id: 1,
    productName: "SME Working Capital B",
    clientCount: 42,
    percentage: 42,
    color: "#12946a",
    value: 42,
  },
  {
    id: 2,
    productName: "SME Revolving Credit Line",
    clientCount: 8,
    percentage: 8,
    color: "#0284C7",
    value: 8,
  },
  {
    id: 3,
    productName: "SME Investment B",
    clientCount: 12,
    percentage: 12,
    color: "#6C4CF1",
    value: 12,
  },
  {
    id: 4,
    productName: "SME Working Capital Restructured",
    clientCount: 13,
    percentage: 13,
    color: "#F59E0B",
    value: 13,
  },
  {
    id: 5,
    productName: "SME Agri Finance",
    clientCount: 25,
    percentage: 25,
    color: "#047857",
    value: 25,
  },
];

const chartConfig = {
  value: {
    label: "Loan Releases",
  },
};

export function PerLoanProduct() {
  const totalClients = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clientCount, 0);
  }, []);

  return (
    <Card className="flex h-full w-full flex-col">
      {/* Header */}
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2 text-lg font-extrabold tracking-tight text-[#191924]">
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl bg-[#FFE3EE] text-[#E0509A] p-2.5 shadow-sm">
              <ChartPie size={18} />
            </span>
            <div>
              <h2 className="text-[#191924] font-bold">Per Loan Product</h2>
              <p className="text-xs font-medium text-[#5a5a70]">
                Portfolio distribution by product type
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold px-3 py-1 bg-[#ffe3ee] text-[#e0509a] rounded-full shadow-sm">
              {chartData.length} Products
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      {/* Content */}
      <CardContent className="flex min-h-0 flex-1">
        <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-65 w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="productName"
                innerRadius={80}
                outerRadius={115}
                strokeWidth={4}
                stroke="#FFFFFF"
              >
                {chartData.map((item) => (
                  <Cell key={item.id} fill={item.color} />
                ))}

                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-[#5a5a70] text-xs font-bold uppercase tracking-wider"
                          >
                            Active Clients
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-[#191924] text-3xl font-extrabold tracking-tight"
                          >
                            {totalClients.toLocaleString()}
                          </tspan>
                        </text>
                      );
                    }

                    return null;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex min-w-0 flex-col gap-2">
            {chartData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-[#191924]/8 bg-slate-50/20 p-2.5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-md shadow-xs"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                  <div className="min-w-0 truncate">
                    <h4 className="truncate text-xs font-bold text-[#191924]">
                      {item.productName}
                    </h4>

                    <p className="font-mono text-[11px] text-[#5a5a70]">
                      {item.clientCount} active client
                      {item.clientCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right pl-2">
                  <span className="text-xs font-extrabold text-[#191924]">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
