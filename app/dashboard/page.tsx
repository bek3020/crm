"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Grafik uchun namunaviy ma'lumotlar
const chartData = [
  { day: "Jun 24", visitors: 450 },
  { day: "Jun 25", visitors: 300 },
  { day: "Jun 26", visitors: 550 },
  { day: "Jun 27", visitors: 400 },
  { day: "Jun 28", visitors: 480 },
  { day: "Jun 29", visitors: 350 },
  { day: "Jun 30", visitors: 600 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-zinc-400">
            Xush kelibsiz! Bu yerda asosiy statistika boladi.
          </p>
        </div>

        {/* 1. Yuqoridagi 4 ta kichik statistika kartalari */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                +12.5%
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250.00</div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Trending up this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                New Customers
              </CardTitle>
              <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                -20%
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Down 20% this period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                +12.5%
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,678</div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Strong user retention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                +4.5%
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5%</div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Steady performance increase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 2. Asosiy Grafik (Total Visitors) */}
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Total Visitors</CardTitle>
            <CardDescription className="text-zinc-500">
              Otgan 7 kunlik statistika
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                data={chartData}
                margin={{ left: 12, right: 12, top: 10 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#333"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="#666"
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="visitors"
                  type="natural"
                  fill="url(#fillVisitors)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default Dashboard;
