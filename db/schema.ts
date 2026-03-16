import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  decimal,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         varchar("name", { length: 100 }).notNull(),
  email:        varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      varchar("name", { length: 100 }).notNull(),
  icon:      varchar("icon", { length: 10 }).default("💰").notNull(),
  color:     varchar("color", { length: 7 }).default("#6366f1").notNull(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable(
  "transactions",
  {
    id:         uuid("id").primaryKey().defaultRandom(),
    title:      varchar("title", { length: 255 }).notNull(),
    amount:     decimal("amount", { precision: 12, scale: 2 }).notNull(),
    type:       transactionTypeEnum("type").notNull(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    userId:     uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    date:       date("date").notNull(),
    notes:      text("notes"),
    createdAt:  timestamp("created_at").defaultNow().notNull(),
    updatedAt:  timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_transactions_user_id").on(t.userId),
    index("idx_transactions_user_type").on(t.userId, t.type),
    index("idx_transactions_user_date").on(t.userId, t.date),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  categories:   many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user:         one(users, { fields: [categories.userId], references: [users.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user:     one(users,      { fields: [transactions.userId],     references: [users.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
}));

// ─── Types ────────────────────────────────────────────────────────────────────

export type User           = typeof users.$inferSelect;
export type NewUser        = typeof users.$inferInsert;
export type Category       = typeof categories.$inferSelect;
export type NewCategory    = typeof categories.$inferInsert;
export type Transaction    = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;