import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const { searchParams } = new URL(req.url);
  const year  = parseInt(searchParams.get("year")  ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));

  const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay  = new Date(year, month, 0).toISOString().split("T")[0];

  // Expenses by category
  const byCategory = await db
    .select({
      categoryId:   transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "expense"),
        gte(transactions.date, firstDay),
        lte(transactions.date, lastDay)
      )
    )
    .groupBy(transactions.categoryId, categories.name, categories.icon, categories.color);

  // Monthly balance for last 6 months
  const monthly = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d     = new Date(year, month - 1 - i, 1);
      const y     = d.getFullYear();
      const m     = d.getMonth() + 1;
      const first = `${y}-${String(m).padStart(2, "0")}-01`;
      const last  = new Date(y, m, 0).toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

      return db
        .select({
          income:  sql<number>`coalesce(sum(case when type = 'income' then amount else 0 end), 0)`,
          expense: sql<number>`coalesce(sum(case when type = 'expense' then amount else 0 end), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            gte(transactions.date, first),
            lte(transactions.date, last)
          )
        )
        .then(([row]) => ({
          month:   label,
          income:  Number(row.income),
          expense: Number(row.expense),
          balance: Number(row.income) - Number(row.expense),
        }));
    })
  );

  return NextResponse.json({
    byCategory: byCategory.map((c) => ({
      name:  c.categoryName ?? "Uncategorized",
      icon:  c.categoryIcon ?? "📦",
      color: c.categoryColor ?? "#6b7280",
      total: Number(c.total),
    })),
    monthly: monthly.reverse(),
  });
});