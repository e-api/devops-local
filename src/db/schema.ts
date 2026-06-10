import { pgTable, serial, text, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";

// Products table
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
});

// Users table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});