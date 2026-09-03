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
    // amountFormatted: "₱42.00M",
    color: "#00BD7D",
    value: 42,
  },
  {
    id: 2,
    productName: "SME Revolving Credit Line",
    clientCount: 8,
    percentage: 8,
    // amountFormatted: "₱8.00M",
    color: "#0284C7",
    value: 8,
  },
  {
    id: 3,
    productName: "SME Investment B",
    clientCount: 12,
    percentage: 12,
    // amountFormatted: "₱12.00M",
    color: "#8B5CF6",
    value: 12,
  },
  {
    id: 4,
    productName: "SME Working Capital Restructured",
    clientCount: 13,
    percentage: 13,
    // amountFormatted: "₱13.00M",
    color: "#F59E0B",
    value: 13,
  },
  {
    id: 5,
    productName: "SME Agri Finance",
    clientCount: 25,
    percentage: 25,
    // amountFormatted: "₱25.00M",
    color: "#064E3B",
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
        <CardTitle className="flex justify-between gap-2 text-lg font-bold tracking-tight text-gray-900">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-50 text-blue-700 p-2">
              <ChartPie size={18} />
            </span>
            <div>
              <h2>Per Loan Product</h2>
              <p className="text-xs font-medium text-gray-500">
                Portfolio distribution by product type
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold px-3 py-1 bg-gray-50 rounded-full text-gray-600 border border-gray-100">
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
            className="mx-auto aspect-square w-full"
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
                outerRadius={120}
                strokeWidth={5}
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
                            y={(viewBox.cy || 0) - 12}
                            className="fill-muted-foreground text-base font-semibold"
                          >
                            Active Clients
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-foreground text-3xl font-bold"
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
          <div className="flex min-w-0 flex-col gap-2.5">
            {chartData.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border bg-slate-50/30 p-3 shadow-sm transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-lg shadow-xs"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                  <div className="min-w-0 truncate">
                    <h4 className="truncate text-xs font-bold text-gray-900">
                      {item.productName}
                    </h4>

                    <p className="font-mono text-[11px] text-gray-400">
                      {item.clientCount} active client
                      {item.clientCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-black text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
