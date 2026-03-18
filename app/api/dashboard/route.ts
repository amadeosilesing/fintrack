import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and, gte, lte, sum, sql } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  // Totals for current month
  const [totals] = await db
    .select({
      totalIncome:  sql<number>`coalesce(sum(case when type = 'income' then amount else 0 end), 0)`,
      totalExpense: sql<number>`coalesce(sum(case when type = 'expense' then amount else 0 end), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, firstDay),
        lte(transactions.date, lastDay)
      )
    );

  // Recent transactions
  const recent = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    with: { category: true },
    orderBy: (t, { desc }) => [desc(t.date), desc(t.createdAt)],
    limit: 5,
  });

  const income  = Number(totals.totalIncome);
  const expense = Number(totals.totalExpense);
  const balance = income - expense;

  return NextResponse.json({ balance, income, expense, recent });
});