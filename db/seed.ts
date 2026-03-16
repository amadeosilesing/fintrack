import { db } from "./index";
import { users, categories, transactions } from "./schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining",  icon: "🍔", color: "#f97316" },
  { name: "Transport",      icon: "🚗", color: "#3b82f6" },
  { name: "Entertainment",  icon: "🎮", color: "#a855f7" },
  { name: "Rent & Housing", icon: "🏠", color: "#ef4444" },
  { name: "Utilities",      icon: "⚡", color: "#eab308" },
  { name: "Health",         icon: "🏥", color: "#22c55e" },
  { name: "Shopping",       icon: "🛍️", color: "#ec4899" },
  { name: "Salary",         icon: "💼", color: "#10b981" },
  { name: "Freelance",      icon: "💻", color: "#6366f1" },
  { name: "Other",          icon: "📦", color: "#6b7280" },
];

async function seed() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const [user] = await db
    .insert(users)
    .values({ name: "Demo User", email: "demo@fintrack.com", passwordHash })
    .onConflictDoNothing()
    .returning();

  if (!user) {
    console.log("⚠️  User already exists — skipping seed.");
    process.exit(0);
  }

  console.log(`✅ User created: ${user.email}`);

  const insertedCategories = await db
    .insert(categories)
    .values(DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: user.id })))
    .returning();

  console.log(`✅ ${insertedCategories.length} categories created`);

  const catByName = Object.fromEntries(insertedCategories.map((c) => [c.name, c]));

  const now   = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();
  const d = (y: number, m: number, day: number) =>
    new Date(y, m, day).toISOString().split("T")[0];

  const sampleTransactions = [
    { title: "Monthly Salary",          amount: "3000", type: "income"  as const, categoryId: catByName["Salary"].id,         date: d(year, month, 1)      },
    { title: "Freelance - Web Project", amount: "800",  type: "income"  as const, categoryId: catByName["Freelance"].id,      date: d(year, month, 10)     },
    { title: "Apartment Rent",          amount: "900",  type: "expense" as const, categoryId: catByName["Rent & Housing"].id, date: d(year, month, 2)      },
    { title: "Groceries",               amount: "120",  type: "expense" as const, categoryId: catByName["Food & Dining"].id,  date: d(year, month, 5)      },
    { title: "Netflix + Spotify",       amount: "25",   type: "expense" as const, categoryId: catByName["Entertainment"].id,  date: d(year, month, 3)      },
    { title: "Electricity Bill",        amount: "65",   type: "expense" as const, categoryId: catByName["Utilities"].id,      date: d(year, month, 7)      },
    { title: "Bus Monthly Pass",        amount: "40",   type: "expense" as const, categoryId: catByName["Transport"].id,      date: d(year, month, 1)      },
    { title: "Restaurant dinner",       amount: "55",   type: "expense" as const, categoryId: catByName["Food & Dining"].id,  date: d(year, month, 12)     },
    { title: "New keyboard",            amount: "95",   type: "expense" as const, categoryId: catByName["Shopping"].id,       date: d(year, month, 8)      },
    { title: "Monthly Salary",          amount: "3000", type: "income"  as const, categoryId: catByName["Salary"].id,         date: d(year, month - 1, 1)  },
    { title: "Apartment Rent",          amount: "900",  type: "expense" as const, categoryId: catByName["Rent & Housing"].id, date: d(year, month - 1, 2)  },
    { title: "Groceries",               amount: "98",   type: "expense" as const, categoryId: catByName["Food & Dining"].id,  date: d(year, month - 1, 6)  },
    { title: "Doctor visit",            amount: "80",   type: "expense" as const, categoryId: catByName["Health"].id,         date: d(year, month - 1, 14) },
    { title: "Freelance - Logo Design", amount: "350",  type: "income"  as const, categoryId: catByName["Freelance"].id,      date: d(year, month - 1, 20) },
  ];

  await db.insert(transactions).values(
    sampleTransactions.map((t) => ({ ...t, userId: user.id }))
  );

  console.log(`✅ ${sampleTransactions.length} transactions created`);
  console.log("\n🎉 Seed complete!");
  console.log("   Demo login → demo@fintrack.com / demo1234");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });