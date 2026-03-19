import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const data = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    with: { category: true },
    orderBy: (t, { desc }) => [desc(t.date), desc(t.createdAt)],
  });
  return NextResponse.json(data);
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json();
  const { title, amount, type, categoryId, date, notes } = body;

  if (!title || !amount || !type || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [transaction] = await db
    .insert(transactions)
    .values({ title, amount, type, categoryId: categoryId || null, userId, date, notes })
    .returning();

  return NextResponse.json(transaction, { status: 201 });
});