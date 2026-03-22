"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ExpensesByCategory from "@/components/statistics/ExpensesByCategory";
import MonthlyChart from "@/components/statistics/MonthlyChart";
import BalanceChart from "@/components/statistics/BalanceChart";

interface CategoryData {
  name: string;
  icon: string;
  color: string;
  total: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface StatisticsData {
  byCategory: CategoryData[];
  monthly: MonthlyData[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function StatisticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/statistics?year=${year}&month=${month}`, { headers })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [token, month, year]);

  const totalExpenses = data?.byCategory.reduce((s, c) => s + c.total, 0) ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your financial insights</p>
        </div>

        {/* Month/Year selector */}
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-green-500 transition"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-green-500 transition"
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Categories used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data?.byCategory.length ?? 0}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Avg monthly balance</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${data?.monthly.length
                  ? (data.monthly.reduce((s, m) => s + m.balance, 0) / data.monthly.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ExpensesByCategory data={data?.byCategory ?? []} />
            <MonthlyChart data={data?.monthly ?? []} />
          </div>

          <BalanceChart data={data?.monthly ?? []} />
        </>
      )}

    </div>
  );
}