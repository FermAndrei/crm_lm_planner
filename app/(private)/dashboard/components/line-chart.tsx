"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", value: 19630967.25 },
  { month: "February", value: 6338503.93 },
  { month: "March", value: 16565669.47 },
  { month: "April", value: 28290238.35 },
  { month: "May", value: 44753530.94 },
  { month: "June", value: 28963594.3 },
  { month: "July", value: 0 },
  { month: "August", value: 0 },
  { month: "September", value: 0 },
  { month: "October", value: 0 },
  { month: "November", value: 0 },
  { month: "December", value: 0 },
];

const chartConfig = {
  value: {
    label: "Loan Release",
    color: "#6C4CF1",
  },
} satisfies ChartConfig;

export function ChartLineLinear() {
  const totalReleases = chartData.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card className="flex h-120 min-w-full flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between gap-2 text-lg font-extrabold tracking-tight text-[#191924]">
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl bg-[#E4E9FF] p-2.5 text-[#4F46E5] shadow-sm">
              <TrendingUp size={18} />
            </span>

            <div className="min-w-0">
              <h2 className="text-[#191924] font-bold">Outstanding Balance</h2>
              <p className="text-xs font-medium text-[#5a5a70]">
                Credit risk ratio & loan portfolio health
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:block text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#9a9ab0] block">
                Total Balance
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-[#e4e9ff] text-[#4f46e5] rounded-full shadow-sm">
                ₱
                {totalReleases.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 min-w-0 flex-1 px-6">
        <ChartContainer config={chartConfig} className="h-full min-w-0 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 35,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <YAxis
              width={85}
              domain={[0, 50000000]}
              ticks={[0, 10000000, 20000000, 30000000, 40000000, 50000000]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (value === 0) return "-";

                return value.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
              }}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) =>
                    Number(value).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              }
            />

            <Line
              dataKey="value"
              type="linear"
              stroke="#006B4A"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            >
              {/* <LabelList
                dataKey="value"
                position="top"
                offset={10}
                className="fill-gray-700 text-xs font-medium"
                formatter={(value) =>
                  Number(value).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }
              /> */}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
