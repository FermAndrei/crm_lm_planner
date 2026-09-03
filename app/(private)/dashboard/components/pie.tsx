"use client";

import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ShieldAlert } from "lucide-react";
import React from "react";

type creditRatio = {
  id: number;
  creditName: string;
  creditCount: number;
  percentage: number;
  color: string;
};

const chartData: creditRatio[] = [
  {
    id: 1,
    creditName: "Past Due",
    creditCount: 3,
    percentage: 16,
    color: "#F59E0B",
  },
  {
    id: 2,
    creditName: "OPB",
    creditCount: 16,
    percentage: 84,
    color: "#064E3B",
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartPieSimple() {
  const totalClients = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.creditCount, 0);
  }, []);
  return (
    <Card className="h-full min-w-full">
      <CardHeader>
        <CardTitle className="flex justify-between gap-2 text-lg font-bold tracking-tight text-gray-900">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-md bg-amber-50 text-amber-700">
              <ShieldAlert size={18} />
            </span>
            <div>
              <h2>Past Due / OPB</h2>
              <p className="text-xs text-gray-500 font-medium">
                Credit risk ratio & loan portfolio health
              </p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1">
        <div className="grid w-full grid-cols-1 items-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="creditCount"
                nameKey="creditName"
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
                            Past Due Ratio
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 14}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalClients.toLocaleString()}%
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-3">
            {/* OPB Card */}
            <div className="p-3 rounded-lg border text-center transition-all bg-emerald-50 border-emerald-300">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#05582E]" />
                  OPB (84%)
                </span>
              </div>
              <p className="text-base font-black text-gray-900">₱90.0M</p>
              <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                16 Active Loans
              </p>
            </div>

            {/* Past Due Card */}
            <div className="p-3 rounded-lg border text-center transition-all bg-amber-50 border-amber-300">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Past Due (16%)
                </span>
              </div>
              <p className="text-base font-black text-amber-600">₱27.5M</p>
              <p className="text-[10px] font-semibold text-amber-800 mt-0.5">
                3 Accounts Warning
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
