"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryStat } from "@/types";

interface Props {
  data: CategoryStat[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function ExpensesByCategory({ data }: Props) {
  const total = data.reduce((s, d) => s + d.total, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Expenses by Category</h2>
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data for this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Expenses by Category</h2>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), ""]}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.icon} {item.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {((item.total / total) * 100).toFixed(1)}%
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}