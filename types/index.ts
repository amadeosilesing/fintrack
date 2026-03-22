export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "income" | "expense";
  date: string;
  notes: string | null;
  category: Category | null;
}

export interface DashboardData {
  balance: number;
  income: number;
  expense: number;
  recent: Transaction[];
}

export interface StatisticsData {
  byCategory: CategoryStat[];
  monthly: MonthlyData[];
}

export interface CategoryStat {
  name: string;
  icon: string;
  color: string;
  total: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}