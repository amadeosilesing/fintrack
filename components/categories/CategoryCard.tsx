import type { Category } from "@/types";

interface Props {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-700 transition">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{category.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
            <p className="text-xs text-gray-400 dark:text-gray-500">{category.color}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(category)}
          className="p-2 rounded-lg text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}