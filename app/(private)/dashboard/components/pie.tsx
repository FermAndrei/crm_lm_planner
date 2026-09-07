"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    color: "#12946a",
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
  const pastDueRatio =
    chartData.find((d) => d.creditName === "Past Due")?.percentage ?? 16;

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2 text-lg font-extrabold tracking-tight text-[#191924]">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-[#FFF3DC] text-[#b0700f] shadow-sm">
              <ShieldAlert size={18} />
            </span>
            <div>
              <h2 className="text-[#191924] font-bold">Past Due / OPB</h2>
              <p className="text-xs text-[#5a5a70] font-medium">
                Credit risk ratio & loan portfolio health
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold px-3 py-1 bg-[#fff3dc] text-[#b0700f] rounded-full shadow-sm">
              84% Current
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1">
        <div className="grid w-full grid-cols-1 items-center gap-4">
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
                dataKey="creditCount"
                nameKey="creditName"
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
                            Past Due Ratio
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-[#191924] text-3xl font-extrabold tracking-tight"
                          >
                            {pastDueRatio}%
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
            <div className="p-3 rounded-2xl border text-center transition-all bg-[#E2F6ED]/70 border-[#12946a]/20 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#12946a]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#12946a]" />
                  OPB (84%)
                </span>
              </div>
              <p className="text-base font-extrabold text-[#191924]">₱90.0M</p>
              <p className="text-[10px] font-semibold text-[#12946a] mt-0.5">
                16 Active Loans
              </p>
            </div>

            {/* Past Due Card */}
            <div className="p-3 rounded-2xl border text-center transition-all bg-[#FFF3DC]/70 border-[#b0700f]/20 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#b0700f]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b0700f]" />
                  Past Due (16%)
                </span>
              </div>
              <p className="text-base font-extrabold text-[#191924]">₱27.5M</p>
              <p className="text-[10px] font-semibold text-[#b0700f] mt-0.5">
                3 Accounts Warning
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
