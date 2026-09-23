"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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
  ShieldAlert,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import CountUp from "@/components/ui/count-up";

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
    color: "#B2D9A6",
  },
  {
    id: 2,
    creditName: "OPB",
    creditCount: 16,
    percentage: 84,
    color: "#1E6E25",
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
  const [position, setPosition] = React.useState("pie_chart");

  const tooltipContent = (
    <ChartTooltipContent
      hideLabel
      formatter={(value, name, item) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {item.payload.percentage}
          </span>

          <span className="font-bold text-[#191924]">
            {item.payload.clientCount} active client
          </span>
        </div>
      )}
    />
  );

  const pastDueRatio =
    chartData.find((d) => d.creditName === "Past Due")?.percentage ?? 16;

  return (
    <Card className="flex h-full min-h-0 flex-col shadow-xs border-gray-200/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-4">
        <CardTitle className="flex flex-col tracking-tight">
          <h2 className="font-semibold text-[#262626]">Past Due</h2>
          <p className="text-xs text-[#5a5a70] font-medium">
            Credit risk ratio & loan portfolio health
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

              {/* <DropdownMenuRadioItem value="line_chart">
                <LineChartIcon />
                Line Chart
              </DropdownMenuRadioItem> */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="min-h-0 flex-1">
        {/* BAR CHART */}
        {position === "bar_chart" && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
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
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />

              <XAxis
                dataKey="creditName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip cursor={false} content={tooltipContent} />

              <defs>
                <linearGradient
                  id="pastDueBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#629966" />
                  <stop offset="100%" stopColor="#1E6E25" />
                </linearGradient>
              </defs>

              <Bar
                dataKey="creditCount"
                fill="url(#pastDueBarGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}

        {/* PIE CHART */}
        {position === "pie_chart" && (
          <div className="grid grid-cols-2 min-[1260px]:grid-cols-1 items-center">
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
                  outerRadius={130}
                >
                  {chartData.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}

                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const cx = Number(viewBox.cx);
                        const cy = Number(viewBox.cy);
                        return (
                          <foreignObject
                            x={cx - 75}
                            y={cy - 35}
                            width={150}
                            height={80}
                          >
                            <div className="flex h-full flex-col items-center justify-center text-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a70]">
                                Past Due Ratio
                              </span>
                              <div className="flex items-baseline justify-center">
                                <span className="mr-1 text-3xl font-extrabold text-[#191924]">
                                  ₱
                                </span>
                                <CountUp
                                  from={0}
                                  to={pastDueRatio}
                                  separator=","
                                  direction="up"
                                  duration={1}
                                  // decimals={1}
                                  className="count-up-text text-3xl font-extrabold tracking-tight text-[#191924]"
                                  delay={0}
                                />
                                <span className="ml-1 text-3xl font-extrabold text-[#191924]">
                                  %
                                </span>
                              </div>
                            </div>
                          </foreignObject>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-1 min-[1260px]:grid-cols-2 h-fit gap-3 mt-4">
              {chartData.map((item) => {
                const isOPB = item.creditName === "OPB";

                const theme = isOPB
                  ? {
                      bg: "bg-white",
                      border: "border-[#1E6E25]/20",
                      text: "text-[#12946a]",
                      dot: "bg-[#1E6E25]",
                      subtitle: `${item.creditCount} Active Loans`,
                      amount: `₱${item.percentage}.0M`,
                    }
                  : {
                      bg: "bg-white",
                      border: "border-[#1E6E25]/20",
                      text: "text-[#12946a]",
                      dot: "bg-[#1E6E25]",
                      subtitle: `${item.creditCount} Accounts Warning`,
                      amount: `₱${item.percentage}.0M`,
                    };
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between rounded-md border border-[#191924]/8 bg-slate-50/20 p-2.5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-sm`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-md shadow-xs"
                        style={{
                          backgroundColor: item.color,
                        }}
                      />
                      <div className="min-w-0 truncate">
                        <p className="text-base font-bold text-[#191924]">
                          {theme.amount}
                        </p>
                        <p className="font-mono text-xs text-[#5a5a70]">
                          {item.creditName}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 font-bold text-lg text-right pl-2">
                      <span>{item.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
