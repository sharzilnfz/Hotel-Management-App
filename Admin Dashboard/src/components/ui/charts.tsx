
import * as React from "react";
import * as Recharts from "recharts";
import { ChartContainer } from "./chart";

// Types for the different chart configs
export type BarChartConfig = {
  xAxis?: Array<{
    data: Array<string>;
    scaleType: string;
  }>;
  series: Array<{
    data: Array<number>;
    label?: string;
    type: "bar";
    color?: string;
  }>;
  height?: number;
  width?: number;
};

export type LineChartConfig = {
  xAxis?: Array<{
    data: Array<string>;
    scaleType: string;
  }>;
  series: Array<{
    data: Array<number>;
    label?: string;
    type: "line";
    color?: string;
    curve?: "linear" | "monotone" | "step" | "stepBefore" | "stepAfter";
  }>;
  height?: number;
  width?: number;
};

export type PieChartConfig = {
  series: Array<{
    data: Array<{
      id: string;
      value: number;
      label?: string;
    }>;
    type: "pie";
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    cornerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    highlightScope?: {
      faded?: string;
      highlighted?: string;
    };
  }>;
  height?: number;
  width?: number;
  legend?: {
    hidden?: boolean;
  };
};

// Create a mapping of colors for our chart configs
const chartColors = {
  primary: "#4f46e5",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
};

// Bar Chart Component
export const BarChart = ({ config }: { config: BarChartConfig }) => {
  const chartConfig = {
    primary: { label: "Primary", theme: { light: chartColors.primary, dark: chartColors.primary } },
    secondary: { label: "Secondary", theme: { light: chartColors.info, dark: chartColors.info } },
    success: { label: "Success", theme: { light: chartColors.success, dark: chartColors.success } },
    warning: { label: "Warning", theme: { light: chartColors.warning, dark: chartColors.warning } },
    danger: { label: "Danger", theme: { light: chartColors.danger, dark: chartColors.danger } },
  };

  return (
    <ChartContainer config={chartConfig}>
      <Recharts.BarChart>
        {config.xAxis?.map((axis, index) => (
          <Recharts.XAxis 
            key={`x-axis-${index}`}
            dataKey="name"
            type="category"
          />
        ))}
        <Recharts.YAxis />
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.Tooltip />
        
        {config.series.map((item, index) => {
          const data = item.data.map((value, i) => ({
            name: config.xAxis?.[0]?.data?.[i] || `Item ${i}`,
            value,
          }));
          
          return (
            <Recharts.Bar 
              key={`bar-${index}`}
              name={item.label}
              dataKey="value"
              fill={item.color || chartColors.primary}
              data={data}
            />
          );
        })}
      </Recharts.BarChart>
    </ChartContainer>
  );
};

// Line Chart Component
export const LineChart = ({ config }: { config: LineChartConfig }) => {
  const chartConfig = {
    primary: { label: "Primary", theme: { light: chartColors.primary, dark: chartColors.primary } },
    secondary: { label: "Secondary", theme: { light: chartColors.info, dark: chartColors.info } },
    success: { label: "Success", theme: { light: chartColors.success, dark: chartColors.success } },
    warning: { label: "Warning", theme: { light: chartColors.warning, dark: chartColors.warning } },
    danger: { label: "Danger", theme: { light: chartColors.danger, dark: chartColors.danger } },
  };

  return (
    <ChartContainer config={chartConfig}>
      <Recharts.LineChart>
        {config.xAxis?.map((axis, index) => (
          <Recharts.XAxis 
            key={`x-axis-${index}`}
            dataKey="name"
            type="category"
          />
        ))}
        <Recharts.YAxis />
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.Tooltip />
        
        {config.series.map((item, index) => {
          const data = item.data.map((value, i) => ({
            name: config.xAxis?.[0]?.data?.[i] || `Item ${i}`,
            value,
          }));
          
          return (
            <Recharts.Line 
              key={`line-${index}`}
              name={item.label}
              dataKey="value"
              stroke={item.color || chartColors.primary}
              data={data}
              type={item.curve || "linear"}
            />
          );
        })}
      </Recharts.LineChart>
    </ChartContainer>
  );
};

// Pie Chart Component
export const PieChart = ({ config }: { config: PieChartConfig }) => {
  const chartConfig = {
    primary: { label: "Primary", theme: { light: chartColors.primary, dark: chartColors.primary } },
    secondary: { label: "Secondary", theme: { light: chartColors.info, dark: chartColors.info } },
    success: { label: "Success", theme: { light: chartColors.success, dark: chartColors.success } },
    warning: { label: "Warning", theme: { light: chartColors.warning, dark: chartColors.warning } },
    danger: { label: "Danger", theme: { light: chartColors.danger, dark: chartColors.danger } },
  };

  const pieColors = [chartColors.primary, chartColors.success, chartColors.warning, chartColors.danger, chartColors.info];

  return (
    <ChartContainer config={chartConfig}>
      <Recharts.PieChart>
        {config.series.map((item, index) => {
          const data = item.data.map((segment) => ({
            name: segment.label || segment.id,
            value: segment.value,
            id: segment.id,
          }));
          
          return (
            <Recharts.Pie
              key={`pie-${index}`}
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={item.innerRadius || 0}
              outerRadius={item.outerRadius || 80}
              paddingAngle={item.paddingAngle || 0}
              cornerRadius={item.cornerRadius || 0}
              startAngle={item.startAngle || 0}
              endAngle={item.endAngle || 360}
            >
              {data.map((entry, i) => (
                <Recharts.Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
              ))}
            </Recharts.Pie>
          );
        })}
        <Recharts.Tooltip />
        {!config.legend?.hidden && <Recharts.Legend />}
      </Recharts.PieChart>
    </ChartContainer>
  );
};
