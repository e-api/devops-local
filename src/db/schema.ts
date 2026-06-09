import { pgTable, serial, text, integer, doublePrecision } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
});