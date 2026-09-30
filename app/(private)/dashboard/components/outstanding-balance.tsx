"use client";

import React from "react";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import CountUp from "@/components/ui/count-up";
import { outstandingBalanceApi } from "@/services/api-manager/dashboard/outstanding-balance/outstanding-balance-api";
import {
  OutstandingBalanceData,
  MonthlyBalanceItem,
} from "@/services/api-manager/dashboard/outstanding-balance/outstanding-balance-type";

export const description = "Outstanding balance chart";

const monthColors = [
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

const FULL_MONTH_NAMES: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

const chartConfig = {
  value: {
    label: "Outstanding Balance",
    color: "#1E6E25",
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

const parseYAxisValue = (valStr: string): number => {
  const clean = valStr.trim().toUpperCase();
  if (clean.endsWith("M")) {
    return (parseFloat(clean.replace("M", "")) || 0) * 1_000_000;
  }
  if (clean.endsWith("K")) {
    return (parseFloat(clean.replace("K", "")) || 0) * 1_000;
  }
  return parseFloat(clean) || 0;
};

const formatYAxisTick = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `${Number.isInteger(k) ? k : k.toFixed(0)}K`;
  }
  return `${value}`;
};

export interface OutstandingBalanceProps {
  data?: OutstandingBalanceData;
}

export function ChartLineLinear({
  data: initialData,
}: OutstandingBalanceProps = {}) {
  const [position, setPosition] = React.useState("line_chart");
  const [apiData, setApiData] = React.useState<OutstandingBalanceData | null>(
    initialData || null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  const loadOutstandingBalance = React.useCallback(async () => {
    try {
      const res = await outstandingBalanceApi.fetchOutstandingBalance();
      if (res?.data) {
        setApiData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load outstanding balance:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to load outstanding balance data";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    loadOutstandingBalance();
  };

  React.useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadOutstandingBalance();
    }
  }, [initialData, loadOutstandingBalance]);

  const chartData = React.useMemo(() => {
    if (!apiData?.monthly_balances || apiData.monthly_balances.length === 0) {
      return [];
    }

    return apiData.monthly_balances.map(
      (item: MonthlyBalanceItem, idx: number) => {
        const fullMonth = FULL_MONTH_NAMES[item.month] || item.month;
        return {
          id: idx + 1,
          month: item.month,
          monthName: `${fullMonth} (${item.month})`,
          value: item.amount,
          amountFormatted: item.formatted_amount.startsWith("₱")
            ? item.formatted_amount
            : `₱${item.formatted_amount}`,
          percentage: item.percentage,
          color: monthColors[idx % monthColors.length],
        };
      },
    );
  }, [apiData]);

  const totalAmount = React.useMemo(() => {
    if (apiData?.total_amount != null) {
      return apiData.total_amount;
    }
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [apiData, chartData]);

  const totalDisplay = React.useMemo(() => {
    if (apiData?.formatted_total_amount) {
      const match = apiData.formatted_total_amount.match(
        /^([\d,.]+)\s*([A-Za-z]+)?$/,
      );
      if (match) {
        return {
          value: parseFloat(match[1].replace(/,/g, "")) || 0,
          suffix: match[2] || "",
        };
      }
    }
    if (totalAmount >= 1_000_000) {
      return {
        value: parseFloat((totalAmount / 1_000_000).toFixed(1)),
        suffix: "M",
      };
    }
    if (totalAmount >= 1_000) {
      return {
        value: parseFloat((totalAmount / 1_000).toFixed(1)),
        suffix: "K",
      };
    }
    return {
      value: totalAmount,
      suffix: "",
    };
  }, [apiData, totalAmount]);

  const yAxisConfig = React.useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.value), 0);

    if (apiData?.y_axis && apiData.y_axis.length > 0) {
      const parsed = apiData.y_axis
        .map(parseYAxisValue)
        .filter((val) => val > 0)
        .sort((a, b) => a - b);

      if (parsed.length > 0) {
        const topTick = parsed[parsed.length - 1];
        const maxDomain = Math.max(topTick, maxVal);
        return {
          domain: [0, maxDomain] as [number, number],
          ticks: [0, ...parsed],
        };
      }
    }

    if (maxVal <= 500_000) {
      return {
        domain: [0, 500_000] as [number, number],
        ticks: [0, 100_000, 200_000, 300_000, 400_000, 500_000],
      };
    }
    if (maxVal <= 1_500_000) {
      return {
        domain: [0, 1_500_000] as [number, number],
        ticks: [0, 500_000, 1_000_000, 1_500_000],
      };
    }
    return {
      domain: [0, 5_000_000] as [number, number],
      ticks: [0, 1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000],
    };
  }, [apiData, chartData]);

  const tooltipContent = (
    <ChartTooltipContent
      hideLabel
      formatter={(value, name, item) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {item.payload.monthName}
          </span>
          <span className="font-bold text-[#191924]">
            {item.payload.amountFormatted || formatAmount(Number(value))}
          </span>
          {item.payload.percentage != null && (
            <span className="text-[10px] text-muted-foreground">
              {item.payload.percentage}% of portfolio
            </span>
          )}
        </div>
      )}
    />
  );

  return (
    <Card className="flex h-120 min-w-full flex-col shadow-xs border-gray-200/70">
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
              <DropdownMenuRadioItem value="line_chart">
                <LineChartIcon />
                Line Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="bar_chart">
                <BarChart2Icon />
                Bar Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="pie_chart">
                <PieChartIcon />
                Pie Chart
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="min-h-0 min-w-0 flex-1 px-6">
        {isLoading ? (
          <div className="flex h-full w-full flex-col justify-end gap-3 pb-4">
            <div className="flex h-56 items-end gap-2 px-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200/80 rounded-t animate-pulse"
                  style={{
                    height: `${[10, 20, 45, 55, 80, 60, 90, 95, 100, 15, 20, 10][i % 12]}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between px-6 pt-2 border-t border-gray-100">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => (
                <div
                  key={m}
                  className="h-3 w-6 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : error && !apiData ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <p className="text-xs text-red-600 font-medium mb-3 max-w-sm">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1E6E25] rounded hover:bg-[#1E6E25]/90 transition"
            >
              Retry
            </button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-xs text-[#5a5a70]">
            No outstanding balance data available.
          </div>
        ) : (
          <>
            {/* LINE CHART */}
            {position === "line_chart" && (
              <ChartContainer
                config={chartConfig}
                className="h-full min-w-0 w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 15,
                    right: 12,
                    bottom: 12,
                    left: 0,
                  }}
                >
                  <CartesianGrid vertical={false} stroke="#F1EEF8" />

                  <YAxis
                    width={45}
                    domain={yAxisConfig.domain}
                    ticks={yAxisConfig.ticks}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatYAxisTick}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />

                  <ChartTooltip cursor={false} content={tooltipContent} />

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
                    width={45}
                    domain={yAxisConfig.domain}
                    ticks={yAxisConfig.ticks}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatYAxisTick}
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
                      id="outstandingBalanceBarGradient"
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
                    dataKey="value"
                    fill="url(#outstandingBalanceBarGradient)"
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
                      <ChartTooltip cursor={false} content={tooltipContent} />
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="month"
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
                                      Total Balance
                                    </span>

                                    <div className="flex items-baseline justify-center">
                                      <span className="mr-1 text-2xl font-extrabold text-[#191924]">
                                        ₱
                                      </span>
                                      <CountUp
                                        from={0}
                                        to={totalDisplay.value}
                                        separator=","
                                        direction="up"
                                        duration={1}
                                        className="count-up-text text-2xl font-extrabold tracking-tight text-[#191924]"
                                        delay={0}
                                      />

                                      {totalDisplay.suffix && (
                                        <span className="ml-1 text-2xl font-extrabold text-[#191924]">
                                          {totalDisplay.suffix}
                                        </span>
                                      )}
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
                <div className="flex min-w-0 flex-col gap-1 max-h-75 overflow-y-auto pr-1">
                  {chartData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border border-[#191924]/8 bg-slate-50/20 px-2 py-1.5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-md shadow-xs"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />
                        <h4 className="truncate text-xs font-bold text-[#191924]">
                          {item.monthName}
                        </h4>
                        <p className="font-mono text-[10px] text-[#5a5a70]">
                          {item.amountFormatted}
                        </p>
                      </div>
                      <span className="shrink-0 pl-2 text-[10px] font-bold text-[#191924]">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { ChartLineLinear as OutstandingBalance };
