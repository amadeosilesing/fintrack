import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/middleware";

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  const data = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(categories.name);
  return NextResponse.json(data);
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  const body = await req.json();
  const { name, icon, color } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const [category] = await db
    .insert(categories)
    .values({ name, icon: icon || "📦", color: color || "#6b7280", userId })
    .returning();

  return NextResponse.json(category, { status: 201 });
});