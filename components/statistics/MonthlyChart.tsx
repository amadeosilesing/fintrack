"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface Props {
  data: MonthlyData[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export default function MonthlyChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Monthly Overview</h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), ""]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
            cursor={{ fill: "#ffffff08" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#9ca3af", paddingTop: "16px" }}
          />
          <Bar dataKey="income"  name="Income"  fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}