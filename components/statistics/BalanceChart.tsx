"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import type { MonthlyData } from "@/types";

interface Props {
  data: MonthlyData[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export default function BalanceChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Balance Trend</h2>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
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
          <Area type="monotone" dataKey="balance" name="Balance" stroke="#16a34a" strokeWidth={2} fill="url(#balanceGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}