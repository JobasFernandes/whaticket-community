import React from "react";
import {
  BarChart,
  CartesianGrid,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { i18n } from "../../translate/i18n";

const Chart = ({ data = [] }) => {
  // Default data if none provided
  const defaultData = [
    { time: "08:00", amount: 0 },
    { time: "09:00", amount: 0 },
    { time: "10:00", amount: 0 },
    { time: "11:00", amount: 0 },
    { time: "12:00", amount: 0 },
    { time: "13:00", amount: 0 },
    { time: "14:00", amount: 0 },
    { time: "15:00", amount: 0 },
    { time: "16:00", amount: 0 },
    { time: "17:00", amount: 0 },
    { time: "18:00", amount: 0 },
    { time: "19:00", amount: 0 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1e1e1e] p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {`${i18n.t("dashboard.charts.ticketsByHour.tooltip.time")}: ${label}`}
          </p>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {`${i18n.t("dashboard.charts.ticketsByHour.tooltip.tickets")}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 0,
            bottom: 5
          }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.9} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
          />

          <XAxis
            dataKey="time"
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            fontSize={11}
            tick={{ dy: 3 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            fontSize={11}
            tick={{ dx: -2 }}
            axisLine={false}
            tickLine={false}
            width={25}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(59, 130, 246, 0.1)",
              radius: [2, 2, 0, 0]
            }}
          />

          <Bar
            dataKey="amount"
            fill="url(#barGradient)"
            radius={[2, 2, 0, 0]}
            maxBarSize={30}
            style={{ cursor: "pointer" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
