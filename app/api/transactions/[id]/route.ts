import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const PUT = withAuth(async (req: NextRequest, userId: string) => {
  const id = req.url.split("/").pop()!;
  const body = await req.json();
  const { title, amount, type, categoryId, date, notes } = body;

  const [updated] = await db
    .update(transactions)
    .set({ title, amount, type, categoryId: categoryId || null, date, notes, updatedAt: new Date() })
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
  const id = req.url.split("/").pop()!;

  const [deleted] = await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
});