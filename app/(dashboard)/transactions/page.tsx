"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import TransactionItem from "@/components/transactions/TransactionItem";
import TransactionModal from "@/components/transactions/TransactionModal";
import DeleteModal from "@/components/ui/DeleteModal";

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

export default function TransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchData = async () => {
    const [t, c] = await Promise.all([
      fetch("/api/transactions", { headers }).then((r) => r.json()),
      fetch("/api/categories", { headers }).then((r) => r.json()),
    ]);
    setTransactions(t);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setShowModal(true);
  };

  const openDelete = (t: Transaction) => {
    setDeleting(t);
    setShowDelete(true);
  };

  const handleSave = async (form: {
    title: string;
    amount: string;
    type: "income" | "expense";
    categoryId: string;
    date: string;
    notes: string;
  }) => {
    setSaving(true);
    try {
      const url = editing ? `/api/transactions/${editing.id}` : "/api/transactions";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) return;
      await fetchData();
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await fetch(`/api/transactions/${deleting.id}`, { method: "DELETE", headers });
      setTransactions((prev) => prev.filter((t) => t.id !== deleting.id));
      setShowDelete(false);
    } finally {
      setDeletingLoading(false);
    }
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
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-green-500"
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
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          editing={editing}
          categories={categories}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}

      {showDelete && deleting && (
        <DeleteModal
          title="Delete transaction"
          description={`Are you sure you want to delete "${deleting.title}"?`}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          loading={deletingLoading}
        />
      )}

    </div>
  );
}