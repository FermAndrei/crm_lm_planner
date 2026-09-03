"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";

export const description = "A bar chart";

export const LOAN_RELEASES_MOCK = [
  {
    month: "1",
    monthName: "Month 1 (Jan)",
    amount: 49200000,
    amountFormatted: "₱49.2M",
    target: 30000000,
    isPeak: true,
  },
  {
    month: "2",
    monthName: "Month 2 (Feb)",
    amount: 38000000,
    amountFormatted: "₱4.8M",
    target: 10000000,
  },
  {
    month: "3",
    monthName: "Month 3 (Mar)",
    amount: 25100000,
    amountFormatted: "₱15.1M",
    target: 12000000,
  },
  {
    month: "4",
    monthName: "Month 4 (Apr)",
    amount: 30200000,
    amountFormatted: "₱3.2M",
    target: 8000000,
  },
  {
    month: "5",
    monthName: "Month 5 (May)",
    amount: 39000000,
    amountFormatted: "₱3.9M",
    target: 8000000,
  },
  {
    month: "6",
    monthName: "Month 6 (Jun)",
    amount: 20000000,
    amountFormatted: "₱8.0M",
    target: 10000000,
  },
  {
    month: "7",
    monthName: "Month 7 (Jul)",
    amount: 7500000,
    amountFormatted: "₱2.5M",
    target: 8000000,
  },
  {
    month: "8",
    monthName: "Month 8 (Aug)",
    amount: 48900000,
    amountFormatted: "₱48.9M",
    target: 30000000,
    isPeak: true,
  },
  {
    month: "9",
    monthName: "Month 9 (Sep)",
    amount: 9200000,
    amountFormatted: "₱9.2M",
    target: 10000000,
  },
  {
    month: "10",
    monthName: "Month 10 (Oct)",
    amount: 5800000,
    amountFormatted: "₱5.8M",
    target: 8000000,
  },
  {
    month: "11",
    monthName: "Month 11 (Nov)",
    amount: 10000000,
    amountFormatted: "₱7.1M",
    target: 8000000,
  },
  {
    month: "12",
    monthName: "Month 12 (Dec)",
    amount: 20500000,
    amountFormatted: "₱20.5M",
    target: 15000000,
  },
];

const chartConfig = {
  amount: {
    label: "Loan Releases",
    color: "#00BD7D",
  },
} satisfies ChartConfig;

const totalReleases = LOAN_RELEASES_MOCK.reduce(
  (sum, item) => sum + item.amount,
  0,
);

export function LoanReleases() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-lg flex-col flex font-bold text-gray-900 tracking-tight">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-md bg-emerald-50 text-[#05582E]">
              <BarChart3 size={18} />
            </span>
            <div>
              <h2>Loan Releases</h2>
              <p className="text-xs text-gray-500 font-medium">
                12-Month loan disbursement volume across portfolio accounts
              </p>
            </div>
          </div>
        </CardTitle>

        <div className="hidden lg:block text-right">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
            Total Released
          </span>
          <span className="text-sm font-black text-[#05582E]">
            ₱{(totalReleases / 1000000).toFixed(1)}M
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={LOAN_RELEASES_MOCK}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        {item.payload.monthName}
                      </span>
                      <span className="font-bold">
                        ₱{(Number(value) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  )}
                />
              }
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00BD7D" />
                <stop offset="100%" stopColor="#006B4A" />
              </linearGradient>
            </defs>
            <Bar
              dataKey="amount"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
