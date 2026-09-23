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
  ChartPie,
  EllipsisVertical,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import CountUp from "@/components/ui/count-up";

type LoanProductBreakdown = {
  id: number;
  productName: string;
  productCode: string;
  clientCount: number;
  percentage: number;
  // amountFormatted: string;
  color: string;
  value: number;
};

const chartData: LoanProductBreakdown[] = [
  {
    id: 1,
    productName: "SME Working Capital B",
    productCode: "SME-WC-B",
    clientCount: 42,
    percentage: 42,
    color: "#1E6E25",
    value: 42,
  },
  {
    id: 2,
    productName: "SME Revolving Credit Line",
    productCode: "SME-RCL",
    clientCount: 8,
    percentage: 8,
    color: "#338C38",
    value: 8,
  },
  {
    id: 3,
    productName: "SME Investment B",
    productCode: "SME-INV-B",
    clientCount: 12,
    percentage: 12,
    color: "#59A659",
    value: 12,
  },
  {
    id: 4,
    productName: "SME Working Capital Restructured",
    productCode: "SME-WC-R",
    clientCount: 13,
    percentage: 13,
    color: "#80BF73",
    value: 13,
  },
  {
    id: 5,
    productName: "SME Agri Finance",
    productCode: "SME-AGRI",
    clientCount: 25,
    percentage: 25,
    color: "#B2D9A6",
    value: 25,
  },
];

const chartConfig = {
  value: {
    label: "Loan Releases",
  },
};

export function PerLoanProduct() {
  const [position, setPosition] = React.useState("pie_chart");

  const totalClients = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clientCount, 0);
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
            {item.payload.clientCount.toLocaleString()} active client
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

      {/* Content */}
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
                dataKey="value"
                fill="url(#perLoanProductBarGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}

        {/* pie chart */}
        {position === "pie_chart" && (
          <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
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
                  dataKey="value"
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
                                Total Releases
                              </span>

                              <div className="flex items-baseline justify-center">
                                <CountUp
                                  from={0}
                                  to={totalClients}
                                  separator=","
                                  direction="up"
                                  duration={1}
                                  // decimals={1}
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
                  {/* <Label
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
                              className="fill-[#5a5a70] text-[11px] font-bold uppercase tracking-wider"
                            >
                              Active Clients
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 16}
                              className="fill-[#191924] text-3xl font-extrabold tracking-tight"
                            >
                              {totalClients.toLocaleString()}
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  /> */}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex min-w-0 flex-col gap-2">
              {chartData.map((item) => (
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
                      <h4 className="truncate text-xs font-bold text-[#191924]">
                        {item.productName}
                      </h4>
                      <p className="font-mono text-[11px] text-[#5a5a70]">
                        {item.clientCount} active client
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
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
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
                dataKey="value"
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
