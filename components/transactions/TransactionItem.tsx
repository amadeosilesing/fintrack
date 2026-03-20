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

interface Props {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TransactionItem({ transaction: t, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
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
            onClick={() => onEdit(t)}
            className="p-2 rounded-lg text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(t)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}