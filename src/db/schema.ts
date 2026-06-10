import { pgTable, serial, text, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core";

// 1. Products Table
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
});

// 2. Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Orders Table (References Users)
export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  total: doublePrecision("total").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 4. Order Items Table (References both Orders and Products)
export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.id).notNull(),
  productId: integer("product_id").references(() => productsTable.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(), // Stores the price at the time of purchase
});