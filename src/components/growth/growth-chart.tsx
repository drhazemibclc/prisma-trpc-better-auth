"use client";

import { Activity, Calendar, Ruler, Weight } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GrowthData {
  age: number;
  date: string;
  height: number;
  heightPercentile: number;
  weight: number;
  weightPercentile: number;
  headCircumference?: number;
}

const mockGrowthData: GrowthData[] = [
  {
    age: 0,
    date: "2022-01-15",
    headCircumference: 35,
    height: 50,
    heightPercentile: 50,
    weight: 3.2,
    weightPercentile: 45,
  },
  {
    age: 2,
    date: "2022-03-15",
    headCircumference: 37,
    height: 55,
    heightPercentile: 55,
    weight: 4.1,
    weightPercentile: 50,
  },
  {
    age: 4,
    date: "2022-05-15",
    headCircumference: 39,
    height: 60,
    heightPercentile: 60,
    weight: 5.2,
    weightPercentile: 55,
  },
  {
    age: 6,
    date: "2022-07-15",
    headCircumference: 41,
    height: 65,
    heightPercentile: 65,
    weight: 6.8,
    weightPercentile: 60,
  },
  {
    age: 9,
    date: "2022-10-15",
    headCircumference: 43,
    height: 70,
    heightPercentile: 70,
    weight: 8.5,
    weightPercentile: 65,
  },
  {
    age: 12,
    date: "2023-01-15",
    headCircumference: 45,
    height: 75,
    heightPercentile: 72,
    weight: 10.2,
    weightPercentile: 68,
  },
  {
    age: 18,
    date: "2023-07-15",
    headCircumference: 47,
    height: 82,
    heightPercentile: 75,
    weight: 12.1,
    weightPercentile: 70,
  },
  {
    age: 24,
    date: "2024-01-15",
    headCircumference: 48,
    height: 87,
    heightPercentile: 75,
    weight: 13.8,
    weightPercentile: 72,
  },
];

const percentileLines = [
  { color: "#ef4444", percentile: 3 },
  { color: "#f97316", percentile: 10 },
  { color: "#eab308", percentile: 25 },
  { color: "#22c55e", percentile: 50 },
  { color: "#3b82f6", percentile: 75 },
  { color: "#8b5cf6", percentile: 90 },
  { color: "#ec4899", percentile: 97 },
];

export function GrowthChart() {
  const [selectedChart, setSelectedChart] = useState<"head" | "height" | "weight">("height");
  const [timeRange, setTimeRange] = useState("all");

  const latestData = mockGrowthData[mockGrowthData.length - 1];

  const getChartData = () => {
    switch (selectedChart) {
      case "head":
        return mockGrowthData.map((d) => ({
          age: d.age,
          percentile: 50,
          value: d.headCircumference,
        }));
      case "height":
        return mockGrowthData.map((d) => ({
          age: d.age,
          percentile: d.heightPercentile,
          value: d.height,
        }));
      case "weight":
        return mockGrowthData.map((d) => ({
          age: d.age,
          percentile: d.weightPercentile,
          value: d.weight,
        }));
      default:
        return [];
    }
  };

  const getChartConfig = () => {
    switch (selectedChart) {
      case "head":
        return {
          color: "#f59e0b",
          current: `${latestData.headCircumference} cm`,
          icon: Activity,
          percentile: "50th percentile",
          title: "Head Circumference for Age",
          unit: "cm",
        };
      case "height":
        return {
          color: "#3b82f6",
          current: `${latestData.height} cm`,
          icon: Ruler,
          percentile: `${latestData.heightPercentile}th percentile`,
          title: "Height for Age",
          unit: "cm",
        };
      case "weight":
        return {
          color: "#10b981",
          current: `${latestData.weight} kg`,
          icon: Weight,
          percentile: `${latestData.weightPercentile}th percentile`,
          title: "Weight for Age",
          unit: "kg",
        };
      default:
        return {
          color: "",
          current: "",
          icon: Activity,
          percentile: "",
          title: "",
          unit: "",
        };
    }
  };

  const chartConfig = getChartConfig();
  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Growth Charts</h1>
          <p className="text-muted-foreground">Track your child's growth and development</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Add Measurement
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Current Height</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{latestData.height} cm</div>
            <p className="text-muted-foreground text-xs">
              {latestData.heightPercentile}th percentile
            </p>
            <Badge variant="secondary" className="mt-2">
              Normal Growth
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Current Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{latestData.weight} kg</div>
            <p className="text-muted-foreground text-xs">
              {latestData.weightPercentile}th percentile
            </p>
            <Badge variant="secondary" className="mt-2">
              Normal Growth
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">BMI</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {(latestData.weight / (latestData.height / 100) ** 2).toFixed(1)}
            </div>
            <p className="text-muted-foreground text-xs">Normal range</p>
            <Badge variant="secondary" className="mt-2">
              Healthy
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <chartConfig.icon className="h-5 w-5" />
                {chartConfig.title}
              </CardTitle>
              <CardDescription>
                Current: {chartConfig.current} ({chartConfig.percentile})
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedChart}
                onValueChange={(value: "head" | "height" | "weight") => setSelectedChart(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="height">Height for Age</SelectItem>
                  <SelectItem value="weight">Weight for Age</SelectItem>
                  <SelectItem value="head">Head Circumference</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  label={{
                    offset: -10,
                    position: "insideBottom",
                    value: "Age (months)",
                  }}
                  dataKey="age"
                />
                <YAxis
                  label={{
                    angle: -90,
                    position: "insideLeft",
                    value: chartConfig.unit,
                  }}
                />
                <Tooltip
                  formatter={(value, _name) => [`${value} ${chartConfig.unit}`, "Measurement"]}
                  labelFormatter={(age) => `Age: ${age} months`}
                />

                {/* Percentile reference lines */}
                {percentileLines.map((line) => (
                  <ReferenceLine
                    key={line.percentile}
                    stroke={line.color}
                    strokeDasharray="2 2"
                    strokeOpacity={0.3}
                    y={line.percentile}
                  />
                ))}

                <Line
                  dataKey="value"
                  activeDot={{ r: 8 }}
                  dot={{ fill: chartConfig.color, r: 6, strokeWidth: 2 }}
                  stroke={chartConfig.color}
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Percentile Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {percentileLines.map((line) => (
              <div key={line.percentile} className="flex items-center gap-1">
                <div className="h-0.5 w-3" style={{ backgroundColor: line.color }} />
                <span>{line.percentile}th percentile</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth History */}
      <Card>
        <CardHeader>
          <CardTitle>Growth History</CardTitle>
          <CardDescription>Recent measurements and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockGrowthData
              .slice(-5)
              .reverse()
              .map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {new Date(data.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs">Age: {data.age} months</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex space-x-4 text-sm">
                      <span>Height: {data.height} cm</span>
                      <span>Weight: {data.weight} kg</span>
                    </div>
                    <div className="flex space-x-4 text-muted-foreground text-xs">
                      <span>{data.heightPercentile}th percentile</span>
                      <span>{data.weightPercentile}th percentile</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
