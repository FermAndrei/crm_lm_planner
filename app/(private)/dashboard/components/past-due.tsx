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
import { pastDueApi } from "@/services/api-manager/dashboard/past-due/past-due-api";
import {
  PastDueData,
  MonthlyBreakdownItem,
} from "@/services/api-manager/dashboard/past-due/past-due-type";

export const description = "Past due chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#1E6E25",
  },
  past_due: {
    label: "Past Due",
    color: "#82C286",
  },
  opb: {
    label: "OPB",
    color: "#1E6E25",
  },
  pastDue: {
    label: "Past Due",
    color: "#82C286",
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

const formatLineYAxisTick = (value: number) => {
  if (value === 0) return "₱0";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `₱${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `₱${Number.isInteger(k) ? k : k.toFixed(0)}K`;
  }
  return `₱${value}`;
};

export interface PastDueProps {
  data?: PastDueData;
  defaultView?: "pie_chart" | "bar_chart" | "line_chart";
}

interface MonthlyLinePoint {
  month: string;
  opb: number;
  pastDue: number;
  opbFormatted: string;
  pastDueFormatted: string;
}

export function ChartPieSimple({
  data: initialData,
  defaultView = "pie_chart",
}: PastDueProps = {}) {
  const [position, setPosition] = React.useState<string>(defaultView);
  const [apiData, setApiData] = React.useState<PastDueData | null>(
    initialData || null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialData);
  const [error, setError] = React.useState<string | null>(null);

  const loadPastDue = React.useCallback(async () => {
    try {
      const res = await pastDueApi.fetchPastDue();
      if (res?.data) {
        setApiData(res.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load past due data:", err);
      const errMsg =
        err instanceof Error ? err.message : "Failed to load past due data";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    loadPastDue();
  };

  React.useEffect(() => {
    if (!initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPastDue();
    }
  }, [initialData, loadPastDue]);

  const chartData = React.useMemo(() => {
    if (!apiData) {
      return [];
    }

    const opb = apiData.outstanding_portfolio_balance;
    const pd = apiData.past_due;

    if (!opb && !pd) {
      return [];
    }

    const items = [];
    if (pd) {
      const pdFormatted = pd.formatted_amount
        ? pd.formatted_amount.startsWith("₱")
          ? pd.formatted_amount
          : `₱${pd.formatted_amount}`
        : formatAmount(pd.amount ?? 0);

      items.push({
        id: 1,
        creditName: "Past Due",
        amount: pd.amount ?? 0,
        amountFormatted: pdFormatted,
        percentage: pd.percentage ?? 0,
        color: "#82C286",
      });
    }

    if (opb) {
      const opbFormatted = opb.formatted_amount
        ? opb.formatted_amount.startsWith("₱")
          ? opb.formatted_amount
          : `₱${opb.formatted_amount}`
        : formatAmount(opb.amount ?? 0);

      items.push({
        id: 2,
        creditName: "OPB",
        amount: opb.amount ?? 0,
        amountFormatted: opbFormatted,
        percentage: opb.percentage ?? 0,
        color: "#1E6E25",
      });
    }

    return items;
  }, [apiData]);

  const monthlyLineChartData = React.useMemo<MonthlyLinePoint[]>(() => {
    const opbBreakdown =
      apiData?.outstanding_portfolio_balance?.monthly_breakdown;
    const pdBreakdown = apiData?.past_due?.monthly_breakdown;

    if (!opbBreakdown && !pdBreakdown) {
      return [];
    }

    const months: string[] = [];
    if (opbBreakdown) {
      opbBreakdown.forEach((item) => {
        if (item.month && !months.includes(item.month)) {
          months.push(item.month);
        }
      });
    }
    if (pdBreakdown) {
      pdBreakdown.forEach((item) => {
        if (item.month && !months.includes(item.month)) {
          months.push(item.month);
        }
      });
    }

    if (months.length === 0) {
      return [];
    }

    return months.map((month) => {
      const opbItem = opbBreakdown?.find((o) => o.month === month);
      const pdItem = pdBreakdown?.find((p) => p.month === month);

      const opbAmount = opbItem?.amount ?? 0;
      const pdAmount = pdItem?.amount ?? 0;

      const opbFormatted = opbItem?.formatted_amount
        ? opbItem.formatted_amount.startsWith("₱")
          ? opbItem.formatted_amount
          : `₱${opbItem.formatted_amount}`
        : formatAmount(opbAmount);

      const pdFormatted = pdItem?.formatted_amount
        ? pdItem.formatted_amount.startsWith("₱")
          ? pdItem.formatted_amount
          : `₱${pdItem.formatted_amount}`
        : formatAmount(pdAmount);

      return {
        month,
        opb: opbAmount,
        pastDue: pdAmount,
        opbFormatted,
        pastDueFormatted: pdFormatted,
      };
    });
  }, [apiData]);

  const lineChartYAxis = React.useMemo(() => {
    const maxVal = Math.max(
      ...monthlyLineChartData.map((d) => Math.max(d.opb, d.pastDue)),
      0,
    );

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

    if (maxVal <= 0) {
      return {
        domain: [0, 100] as [number, number],
        ticks: [0, 25, 50, 75, 100],
      };
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
    if (maxVal <= 5_000_000) {
      return {
        domain: [0, 5_000_000] as [number, number],
        ticks: [0, 1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000],
      };
    }
    if (maxVal <= 10_000_000) {
      return {
        domain: [0, 10_000_000] as [number, number],
        ticks: [0, 2_000_000, 4_000_000, 6_000_000, 8_000_000, 10_000_000],
      };
    }
    if (maxVal <= 50_000_000) {
      return {
        domain: [0, 50_000_000] as [number, number],
        ticks: [0, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000],
      };
    }
    if (maxVal <= 200_000_000) {
      return {
        domain: [0, 200_000_000] as [number, number],
        ticks: [0, 50_000_000, 100_000_000, 150_000_000, 200_000_000],
      };
    }

    const step =
      Math.ceil(maxVal / 4 / 10_000_000) * 10_000_000 || Math.ceil(maxVal / 4);
    return {
      domain: [0, step * 4] as [number, number],
      ticks: [0, step, step * 2, step * 3, step * 4],
    };
  }, [apiData, monthlyLineChartData]);

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

    if (maxVal <= 0) {
      return {
        domain: [0, 100] as [number, number],
        ticks: [0, 25, 50, 75, 100],
      };
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
    if (maxVal <= 5_000_000) {
      return {
        domain: [0, 5_000_000] as [number, number],
        ticks: [0, 1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000],
      };
    }
    if (maxVal <= 10_000_000) {
      return {
        domain: [0, 10_000_000] as [number, number],
        ticks: [0, 2_000_000, 4_000_000, 6_000_000, 8_000_000, 10_000_000],
      };
    }
    if (maxVal <= 50_000_000) {
      return {
        domain: [0, 50_000_000] as [number, number],
        ticks: [0, 10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000],
      };
    }
    if (maxVal <= 200_000_000) {
      return {
        domain: [0, 200_000_000] as [number, number],
        ticks: [0, 50_000_000, 100_000_000, 150_000_000, 200_000_000],
      };
    }

    const step =
      Math.ceil(maxVal / 4 / 10_000_000) * 10_000_000 || Math.ceil(maxVal / 4);
    return {
      domain: [0, step * 4] as [number, number],
      ticks: [0, step, step * 2, step * 3, step * 4],
    };
  }, [apiData, chartData]);

  const tooltipContent = (
    <ChartTooltipContent
      hideLabel
      formatter={(value, name, item) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            {item.payload.creditName}
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

  const lineTooltipContent = (
    <ChartTooltipContent
      labelClassName="font-semibold text-[#191924]"
      formatter={(value, name, item) => {
        const isOPB = name === "opb" || name === "OPB";
        const label = isOPB ? "OPB" : "Past Due";
        const color = isOPB ? "#1E6E25" : "#82C286";
        const formatted =
          (isOPB
            ? item.payload?.opbFormatted
            : item.payload?.pastDueFormatted) || formatAmount(Number(value));

        return (
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <span className="font-bold text-[#191924]">{formatted}</span>
          </div>
        );
      }}
    />
  );

  const summaryParRate =
    apiData?.formatted_par_rate ||
    (apiData?.par_rate != null ? `${apiData.par_rate}%` : "—");

  const summaryClients = apiData?.past_due_total_clients ?? 0;

  return (
    <Card className="flex h-full min-h-0 flex-col shadow-xs border-gray-200/70">
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-2">
        <CardTitle className="flex flex-col tracking-tight">
          <h2 className="font-semibold text-[#262626]">Past Due</h2>
          <p className="text-xs text-[#5a5a70] font-medium">
            {position === "line_chart"
              ? "Outstanding portfolio balance vs past due ratio."
              : "Credit risk ratio & loan portfolio health"}
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

      <CardContent className="min-h-0 flex-1">
        {isLoading && !apiData ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 gap-4">
            <div className="h-32 w-32 rounded-full border-8 border-gray-200 border-t-emerald-600 animate-spin" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
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
        ) : (
            position === "line_chart"
              ? monthlyLineChartData.length === 0
              : chartData.length === 0
          ) ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-xs text-[#5a5a70]">
            {position === "line_chart"
              ? "No past due breakdown data available."
              : "No past due data available."}
          </div>
        ) : (
          <>
            {/* PIE CHART */}
            {position === "pie_chart" && (
              <div className="grid grid-cols-2 min-[1260px]:grid-cols-1 items-center">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-65 w-full"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={tooltipContent} />
                    <Pie
                      data={chartData}
                      dataKey="amount"
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
                                    PAR Rate
                                  </span>
                                  <div className="flex items-baseline justify-center">
                                    <CountUp
                                      from={0}
                                      to={apiData?.par_rate ?? 0}
                                      separator=","
                                      direction="up"
                                      duration={1}
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
                    const subtitle = isOPB
                      ? "Outstanding Portfolio"
                      : `${summaryClients} Account${
                          summaryClients !== 1 ? "s" : ""
                        } Warning`;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md border border-[#191924]/8 bg-slate-50/20 p-2.5 shadow-xs transition-all duration-200 hover:bg-white hover:shadow-sm"
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
                              {item.amountFormatted}
                            </p>
                            <p className="font-mono text-xs text-[#5a5a70]">
                              {subtitle}
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
                    dataKey="amount"
                    fill="url(#pastDueBarGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}

            {/*LINE CHART */}
            {position === "line_chart" && (
              <div className="flex h-full w-full flex-col justify-between">
                <ChartContainer
                  config={chartConfig}
                  className="h-65 sm:h-72 w-full aspect-auto"
                >
                  <LineChart
                    accessibilityLayer
                    data={monthlyLineChartData}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 8,
                      left: 0,
                    }}
                  >
                    <CartesianGrid vertical={false} stroke="#F1EEF8" />

                    <YAxis
                      width={55}
                      domain={lineChartYAxis.domain}
                      ticks={lineChartYAxis.ticks}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{
                        fill: "#8c8c9e",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                      tickFormatter={formatLineYAxisTick}
                    />

                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{
                        fill: "#8c8c9e",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />

                    <ChartTooltip cursor={false} content={lineTooltipContent} />

                    <Line
                      type="linear"
                      dataKey="opb"
                      name="OPB"
                      stroke="#1E6E25"
                      strokeWidth={2.5}
                      dot={{
                        r: 4.5,
                        fill: "#1E6E25",
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#1E6E25",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />

                    <Line
                      type="linear"
                      dataKey="pastDue"
                      name="Past Due"
                      stroke="#82C286"
                      strokeWidth={2.5}
                      dot={{
                        r: 4.5,
                        fill: "#82C286",
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#82C286",
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ChartContainer>

                <div className="flex flex-col items-center gap-1.5 mt-2 pb-1">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#1E6E25]" />
                      <span className="text-xs font-medium text-[#4b5563]">
                        OPB
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#82C286]" />
                      <span className="text-xs font-medium text-[#4b5563]">
                        Past Due
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[#5a5a70] text-center">
                    PAR Rate: {summaryParRate} &bull; {summaryClients} Past Due
                    Client
                    {summaryClients !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { ChartPieSimple as PastDue };
