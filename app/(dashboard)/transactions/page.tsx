"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  notes: string | null;
  category: Category | null;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const EMPTY_FORM = {
  title: "",
  amount: "",
  type: "expense" as "income" | "expense",
  categoryId: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function TransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch("/api/transactions", { headers }).then((r) => r.json()),
      fetch("/api/categories", { headers }).then((r) => r.json()),
    ]).then(([t, c]) => {
      setTransactions(t);
      setCategories(c);
      setLoading(false);
    });
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({
      title: t.title,
      amount: t.amount,
      type: t.type,
      categoryId: t.category?.id ?? "",
      date: t.date,
      notes: t.notes ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/transactions/${editing.id}` : "/api/transactions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) return;

      const [t, c] = await Promise.all([
        fetch("/api/transactions", { headers }).then((r) => r.json()),
        fetch("/api/categories", { headers }).then((r) => r.json()),
      ]);
      setTransactions(t);
      setCategories(c);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE", headers });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = transactions.filter((t) => filter === "all" || t.type === filter);

  const totalIncome  = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your income and expenses</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <span className="text-lg">+</span> Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "income", "expense"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
              filter === f
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-green-500 dark:hover:border-green-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💸</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found</p>
            <button onClick={openCreate} className="mt-4 text-sm text-green-600 dark:text-green-500 font-medium hover:underline">
              Add your first transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
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
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-2 rounded-lg text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              {/* Type toggle */}
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, type })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition capitalize ${
                      form.type === type
                        ? type === "income"
                          ? "bg-green-600 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {type === "income" ? "📈 Income" : "📉 Expense"}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Monthly Salary"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes <span className="text-gray-400">(optional)</span></label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Add a note..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title || !form.amount || !form.date}
                  className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : editing ? "Save changes" : "Add transaction"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}