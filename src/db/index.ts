import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:securepassword@localhost:5432/ecommerce";

const pool = new Pool({
  connectionString,
});

// Initialize drizzle with the node-postgres pool client
export const db = drizzle({ client: pool, schema });