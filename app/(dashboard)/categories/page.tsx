"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import CategoryCard from "@/components/categories/CategoryCard";
import CategoryModal from "@/components/categories/CategoryModal";
import DeleteModal from "@/components/ui/DeleteModal";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchCategories = async () => {
    const data = await fetch("/api/categories", { headers }).then((r) => r.json());
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    fetchCategories();
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setShowModal(true);
  };

  const openDelete = (category: Category) => {
    setDeleting(category);
    setShowDelete(true);
  };

  const handleSave = async (form: { name: string; icon: string; color: string }) => {
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) return;
      await fetchCategories();
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await fetch(`/api/categories/${deleting.id}`, { method: "DELETE", headers });
      setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
      setShowDelete(false);
    } finally {
      setDeletingLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Organize your transactions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <span className="text-lg">+</span> Add Category
        </button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center py-16">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No categories yet</p>
          <button onClick={openCreate} className="mt-4 text-sm text-green-600 dark:text-green-500 font-medium hover:underline">
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CategoryModal
          editing={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}

      {showDelete && deleting && (
        <DeleteModal
          title="Delete category"
          description={`Are you sure you want to delete "${deleting.name}"? Transactions will not be deleted.`}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
          loading={deletingLoading}
        />
      )}

    </div>
  );
}