"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  BarChart2Icon,
  EllipsisVertical,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

type OutstandingBalanceMock = {
  id: number;
  month: string;
  value: number;
  color: string;
};

const chartData: OutstandingBalanceMock[] = [
  { id: 1, month: "Jan", value: 19630967.25, color: "#83AF87" },
  { id: 2, month: "Feb", value: 6338503.93, color: "#76A77A" },
  { id: 3, month: "Mar", value: 16565669.47, color: "#8CB590" },
  { id: 4, month: "Apr", value: 28290238.35, color: "#5D9762" },
  { id: 5, month: "May", value: 44753530.94, color: "#6DA171" },
  { id: 6, month: "Jun", value: 28963594.3, color: "#4D8C53" },
  { id: 7, month: "Jul", value: 0, color: "#639B68" },
  { id: 8, month: "Aug", value: 0, color: "#1E6E25" },
  { id: 9, month: "Sep", value: 0, color: "#377E3D" },
  { id: 10, month: "Oct", value: 0, color: "#1fad2f" },
  { id: 11, month: "Nov", value: 0, color: "#3fa24a" },
  { id: 12, month: "Dec", value: 0, color: "#0f5718" },
];

const chartConfig = {
  value: {
    label: "Loan Release",
    color: "#6C4CF1",
  },
} satisfies ChartConfig;

const formatAmount = (value: number) => {
  if (value >= 1_000_000) {
    return `₱${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `₱${(value / 1_000).toFixed(1)}K`;
  }

  return `₱${value.toLocaleString()}`;
};

const getPercentage = (value: number, total: number) => {
  if (!total) {
    return "0.0";
  }

  return ((value / total) * 100).toFixed(1);
};

export function ChartLineLinear() {
  const [position, setPosition] = React.useState("line_chart");

  const visibleChartData = React.useMemo(() => {
    return chartData.filter((item) => item.value > 0);
  }, []);

  const totalReleases = React.useMemo(() => {
    return visibleChartData.reduce((sum, item) => sum + item.value, 0);
  }, []);

  const tooltipContent = (
    <ChartTooltipContent
      hideLabel
      formatter={(value, name, item) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {item.payload.monthName}
          </span>

          <span className="font-bold text-[#191924]">
            {formatAmount(Number(value))}
          </span>
        </div>
      )}
    />
  );

  return (
    <Card className="flex h-120 min-w-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-4">
        <CardTitle className="flex flex-col tracking-tight">
          <h2 className="font-semibold text-[#262626]">Outstanding Balance</h2>
          <p className="text-xs font-medium text-[#5a5a70]">
            Monthly outstanding portfolio balance trend across all product
            types.
          </p>
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="text-[#737373]" size={18} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-40">
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="bar_chart">
                <BarChart2Icon />
                Bar Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="pie_chart">
                <PieChartIcon />
                Pie Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="line_chart">
                <LineChartIcon />
                Line Chart
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="min-h-0 min-w-0 flex-1 px-6">
        {/* BAR CHART */}
        {position === "bar_chart" && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={visibleChartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} stroke="#F1EEF8" />

              <YAxis
                width={40}
                domain={[0, 50000000]}
                ticks={[0, 10000000, 20000000, 30000000, 40000000, 50000000]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value === 0) return "0";
                  return `${value / 1000000}M`;
                }}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip cursor={false} content={tooltipContent} />

              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#629966" />

                  <stop offset="100%" stopColor="#1E6E25" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}

        {/* PIE CHART */}
        {position === "pie_chart" && (
          <div className="grid w-full h-full grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex min-h-70 w-full items-center justify-center">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-70 w-full max-w-[320px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={visibleChartData}
                    dataKey="value"
                    nameKey="month"
                    innerRadius={80}
                    outerRadius={130}
                  >
                    {visibleChartData.map((item) => (
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
                                className="fill-[#5a5a70] text-[11px] font-bold uppercase tracking-wider"
                              >
                                Total Releases
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 18}
                                className="fill-[#191924] text-2xl font-extrabold tracking-tight"
                              >
                                {formatAmount(totalReleases)}
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
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              {visibleChartData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border border-[#191924]/8 bg-slate-50/20 px-2 py-1 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-md shadow-xs"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                    <h4 className="truncate text-[10px] font-bold text-[#191924]">
                      {item.month}
                    </h4>
                    <p className="font-mono text-[10px] text-[#5a5a70]">
                      {formatAmount(item.value)} release
                      {item.value !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="shrink-0 pl-2 text-[10px] font-bold text-[#191924]">
                    {getPercentage(item.value, totalReleases)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LINE CHART */}
        {position === "line_chart" && (
          <ChartContainer
            config={chartConfig}
            className="h-full min-w-0 w-full"
          >
            <LineChart
              accessibilityLayer
              data={visibleChartData}
              margin={{
                top: 35,
                right: 12,
                bottom: 12,
                left: 12,
              }}
            >
              <CartesianGrid vertical={false} />

              <YAxis
                width={40}
                domain={[0, 50000000]}
                ticks={[0, 10000000, 20000000, 30000000, 40000000, 50000000]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value === 0) return "0";
                  return `${value / 1000000}M`;
                }}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
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
                type="linear"
                dataKey="value"
                stroke="#5D9762"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#05512A",
                  strokeWidth: 0,
                  stroke: "#FFFFFF",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
