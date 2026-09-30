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
import {
  BarChart2Icon,
  EllipsisVertical,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import CountUp from "@/components/ui/count-up";
import { perLoanProductApi } from "@/services/api-manager/dashboard/per-loan-product/per-loan-product-api";
import {
  PerLoanProductData,
  LoanProductItem,
} from "@/services/api-manager/dashboard/per-loan-product/per-loan-product-type";

export const description = "Per Loan Product breakdown chart";

const productColors = [
  "#1E6E25",
  "#338C38",
  "#4D8C53",
  "#5D9762",
  "#6DA171",
  "#76A77A",
  "#83AF87",
  "#8CB590",
  "#9FC4A3",
  "#B2D9A6",
  "#629966",
  "#377E3D",
  "#1fad2f",
  "#3fa24a",
  "#0f5718",
];

const chartConfig = {
  amount: {
    label: "Per Loan Product",
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

export interface PerLoanProductProps {
  data?: PerLoanProductData;
}

export function PerLoanProduct({ data: initialData }: PerLoanProductProps = {}) {
  const [position, setPosition] = React.useState("pie_chart");
  const [apiData, setApiData] = React.useState<PerLoanProductData | null>(
    initialData || null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  const loadPerLoanProduct = React.useCallback(async () => {
    try {
      const res = await perLoanProductApi.fetchPerLoanProduct();
      if (res?.data) {
        setApiData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load per loan product:", err);
      const errMsg =
        err instanceof Error ? err.message : "Failed to load per loan product data";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    loadPerLoanProduct();
  };

  React.useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPerLoanProduct();
    }
  }, [initialData, loadPerLoanProduct]);

  const chartData = React.useMemo(() => {
    if (!apiData?.products || apiData.products.length === 0) {
      return [];
    }

    return apiData.products.map((item: LoanProductItem, idx: number) => ({
      id: idx + 1,
      productName: item.product_description,
      productCode: item.product_type,
      clientCount: item.total_clients,
      amount: item.total_amount,
      amountFormatted: item.formatted_amount.startsWith("₱")
        ? item.formatted_amount
        : `₱${item.formatted_amount}`,
      percentage: item.percentage,
      color: productColors[idx % productColors.length],
    }));
  }, [apiData]);

  const totalClients = React.useMemo(() => {
    if (apiData?.total_active_clients != null) {
      return apiData.total_active_clients;
    }
    return chartData.reduce((acc, curr) => acc + curr.clientCount, 0);
  }, [apiData, chartData]);

  const yAxisConfig = React.useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.amount), 0);

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
            {item.payload.productName} ({item.payload.productCode})
          </span>
          <span className="font-bold text-[#191924]">
            {item.payload.amountFormatted || formatAmount(Number(value))}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {item.payload.clientCount.toLocaleString()} active client
            {item.payload.clientCount !== 1 ? "s" : ""} •{" "}
            {item.payload.percentage}% of clients
          </span>
        </div>
      )}
    />
  );

  return (
    <Card className="flex h-full min-h-0 shadow-xs border-gray-200/70 flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-4">
        <CardTitle className="flex flex-col tracking-tight">
          <h2 className="font-semibold text-[#262626]">Per Loan Product</h2>
          <p className="text-xs font-medium text-[#5a5a70]">
            Portfolio distribution by product type
            {chartData.length > 0 ? ` (${chartData.length} products)` : ""}
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
              <DropdownMenuRadioItem value="pie_chart">
                <PieChartIcon />
                Pie Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="bar_chart">
                <BarChart2Icon />
                Bar Chart
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="line_chart">
                <LineChartIcon />
                Line Chart
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Content */}
      <CardContent className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full w-full flex-col justify-end gap-3 pb-4">
            <div className="flex h-56 items-end gap-2 px-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200/80 rounded-t animate-pulse"
                  style={{
                    height: `${[35, 60, 85, 20, 45, 15, 70, 30][i % 8]}%`,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between px-6 pt-2 border-t border-gray-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-8 bg-gray-200 rounded animate-pulse"
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
            No loan product data available.
          </div>
        ) : (
          <>
            {/* PIE CHART */}
            {position === "pie_chart" && (
              <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-65 w-full"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={tooltipContent} />

                    <Pie
                      data={chartData}
                      dataKey="clientCount"
                      nameKey="productName"
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
                                    Active Clients
                                  </span>

                                  <div className="flex items-baseline justify-center">
                                    <CountUp
                                      from={0}
                                      to={totalClients}
                                      separator=","
                                      direction="up"
                                      duration={1}
                                      className="count-up-text text-3xl font-extrabold tracking-tight text-[#191924]"
                                      delay={0}
                                    />
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

                <div className="flex min-w-0 flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
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
                        <div className="min-w-0 truncate">
                          <h4 className="truncate text-xs font-bold text-[#191924]">
                            {item.productName}
                          </h4>
                          <p className="font-mono text-[10px] text-[#5a5a70]">
                            {item.amountFormatted} • {item.clientCount} active client
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
                    tickMargin={8}
                    axisLine={false}
                    tickFormatter={formatYAxisTick}
                  />

                  <XAxis
                    dataKey="productCode"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />

                  <ChartTooltip cursor={false} content={tooltipContent} />

                  <defs>
                    <linearGradient
                      id="perLoanProductBarGradient"
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
                    fill="url(#perLoanProductBarGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
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
                    dataKey="productCode"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
