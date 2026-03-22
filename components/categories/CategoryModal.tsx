"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types";

interface Props {
  editing: Category | null;
  onSave: (form: { name: string; icon: string; color: string }) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

const COLORS = [
  "#f97316", "#3b82f6", "#a855f7", "#ef4444",
  "#eab308", "#22c55e", "#ec4899", "#10b981",
  "#6366f1", "#6b7280", "#14b8a6", "#f43f5e",
];

const ICONS = [
  "🍔", "🚗", "🎮", "🏠", "⚡", "🏥", "🛍️",
  "💼", "💻", "📦", "✈️", "🎓", "💪", "🐶",
  "🎵", "📱", "🍕", "☕", "🏋️", "💅",
];

export default function CategoryModal({ editing, onSave, onClose, saving }: Props) {
  const [form, setForm] = useState({ name: "", icon: "📦", color: "#6b7280" });

  useEffect(() => {
    if (editing) {
      setForm({ name: editing.name, icon: editing.icon, color: editing.color });
    } else {
      setForm({ name: "", icon: "📦", color: "#6b7280" });
    }
  }, [editing]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {editing ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-5">

          <div className="flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${form.color}20` }}
            >
              {form.icon}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Food & Dining"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
            <div className="grid grid-cols-10 gap-1.5">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition ${
                    form.icon === icon
                      ? "bg-green-600/20 border-2 border-green-500"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-lg transition ${
                    form.color === color ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              disabled={saving || !form.name}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Add category"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}