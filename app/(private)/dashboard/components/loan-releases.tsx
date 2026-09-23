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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React from "react";
import CountUp from "@/components/ui/count-up";

export const description = "Loan releases chart";

type LoanReleasesMock = {
  id: number;
  month: string;
  monthName: string;
  amount: number;
  amountFormatted: string;
  target: number;
  isPeak?: boolean;
  color: string;
};

const pieColors = [
  "#83AF87",
  "#76A77A",
  "#8CB590",
  "#5D9762",
  "#6DA171",
  "#4D8C53",
  "#639B68",
  "#1E6E25",
  "#377E3D",
  "#1fad2f",
  "#3fa24a",
  "#0f5718",
];

const chartData: LoanReleasesMock[] = [
  {
    id: 1,
    month: "Jan",
    monthName: "Month 1 (Jan)",
    amount: 49200000,
    amountFormatted: "₱49.2M",
    target: 30000000,
    isPeak: true,
    color: pieColors[0],
  },
  {
    id: 2,
    month: "Feb",
    monthName: "Month 2 (Feb)",
    amount: 38000000,
    amountFormatted: "₱38.0M",
    target: 10000000,
    color: pieColors[1],
  },
  {
    id: 3,
    month: "Mar",
    monthName: "Month 3 (Mar)",
    amount: 25100000,
    amountFormatted: "₱25.1M",
    target: 12000000,
    color: pieColors[2],
  },
  {
    id: 4,
    month: "Apr",
    monthName: "Month 4 (Apr)",
    amount: 30200000,
    amountFormatted: "₱30.2M",
    target: 8000000,
    color: pieColors[3],
  },
  {
    id: 5,
    month: "May",
    monthName: "Month 5 (May)",
    amount: 39000000,
    amountFormatted: "₱39.0M",
    target: 8000000,
    color: pieColors[4],
  },
  {
    id: 6,
    month: "Jun",
    monthName: "Month 6 (Jun)",
    amount: 20000000,
    amountFormatted: "₱20.0M",
    target: 10000000,
    color: pieColors[5],
  },
  {
    id: 7,
    month: "Jul",
    monthName: "Month 7 (Jul)",
    amount: 7500000,
    amountFormatted: "₱7.5M",
    target: 8000000,
    color: pieColors[6],
  },
  {
    id: 8,
    month: "Aug",
    monthName: "Month 8 (Aug)",
    amount: 48900000,
    amountFormatted: "₱48.9M",
    target: 30000000,
    isPeak: true,
    color: pieColors[7],
  },
  {
    id: 9,
    month: "Sep",
    monthName: "Month 9 (Sep)",
    amount: 9200000,
    amountFormatted: "₱9.2M",
    target: 10000000,
    color: pieColors[8],
  },
  {
    id: 10,
    month: "Oct",
    monthName: "Month 10 (Oct)",
    amount: 5800000,
    amountFormatted: "₱5.8M",
    target: 8000000,
    color: pieColors[9],
  },
  {
    id: 11,
    month: "Nov",
    monthName: "Month 11 (Nov)",
    amount: 10000000,
    amountFormatted: "₱10.0M",
    target: 8000000,
    color: pieColors[10],
  },
  {
    id: 12,
    month: "Dec",
    monthName: "Month 12 (Dec)",
    amount: 20500000,
    amountFormatted: "₱20.5M",
    target: 15000000,
    color: pieColors[11],
  },
];

const chartConfig = {
  amount: {
    label: "Loan Releases",
    color: "#00BD7D",
  },
} satisfies ChartConfig;

const formatAmount = (amount: number) => {
  if (amount >= 1_000_000) {
    return `₱${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `₱${(amount / 1_000).toFixed(1)}K`;
  }

  return `₱${amount.toLocaleString()}`;
};

const getPercentage = (amount: number, total: number) => {
  if (!total) {
    return "0.0";
  }

  return ((amount / total) * 100).toFixed(1);
};

export function LoanReleases() {
  const [position, setPosition] = React.useState("bar_chart");

  const totalReleases = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
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
    <Card className="flex h-full min-h-0 shadow-xs border-gray-200/70 flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-4">
        <CardTitle className="flex flex-col tracking-tight">
          <h2 className="font-semibold text-[#262626]">Loan Releases</h2>
          <p className="text-xs text-[#5a5a70] font-medium">
            12-Month loan disbursement volume across portfolio accounts
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
                <linearGradient
                  id="loanReleasesBarGradient"
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
                dataKey="amount"
                fill="url(#loanReleasesBarGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}

        {/* PIE CHART */}
        {position === "pie_chart" && (
          <div className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Pie chart area */}
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
                    data={chartData}
                    dataKey="amount"
                    nameKey="monthName"
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
                                  Total Releases
                                </span>

                                <div className="flex items-baseline justify-center">
                                  <span className="mr-1 text-2xl font-extrabold text-[#191924]">
                                    ₱
                                  </span>
                                  <CountUp
                                    from={0}
                                    to={totalReleases / 1_000_000}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    // decimals={1}
                                    className="count-up-text text-2xl font-extrabold tracking-tight text-[#191924]"
                                    delay={0}
                                  />

                                  <span className="ml-1 text-2xl font-extrabold text-[#191924]">
                                    M
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
            </div>
            {/* Pie chart legend */}
            <div className="flex min-w-0 flex-col gap-1">
              {chartData.map((item) => (
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
                      {item.monthName}
                    </h4>
                    <p className="font-mono text-[10px] text-[#5a5a70]">
                      {formatAmount(item.amount)} release
                      {item.amount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="shrink-0 pl-2 text-[10px] font-bold text-[#191924]">
                    {getPercentage(item.amount, totalReleases)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LINE CHART */}
        {position === "line_chart" && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
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
                tickMargin={10}
              />

              <ChartTooltip cursor={false} content={tooltipContent} />

              <Line
                type="linear"
                dataKey="amount"
                stroke="#5D9762"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#05512A",
                  strokeWidth: 0,
                  stroke: "#FFFFFF",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
