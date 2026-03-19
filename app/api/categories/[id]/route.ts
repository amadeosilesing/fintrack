import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const PUT = withAuth(async (req: NextRequest, userId: string) => {
  const id = req.url.split("/").pop()!;
  const body = await req.json();
  const { name, icon, color } = body;

  const [updated] = await db
    .update(categories)
    .set({ name, icon, color })
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
});

export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
  const id = req.url.split("/").pop()!;

  const [deleted] = await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
});