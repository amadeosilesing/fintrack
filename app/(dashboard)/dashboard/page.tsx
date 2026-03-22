"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { DashboardData } from "@/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch("/api/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <p className="text-green-100 text-sm font-medium">Total Balance</p>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💰</div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(data?.balance ?? 0)}</p>
          <p className="text-green-100 text-xs mt-2">Current month</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</p>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-xl">📈</div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(data?.income ?? 0)}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">Current month</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expenses</p>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-xl">📉</div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(data?.expense ?? 0)}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">Current month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <a href="/transactions" className="text-sm text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium transition">
            View all
          </a>
        </div>

        {data?.recent.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">💸</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: t.category?.color ? `${t.category.color}20` : "#6b728020" }}
                  >
                    {t.category?.icon ?? "💸"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {t.category?.name ?? "Uncategorized"} · {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}