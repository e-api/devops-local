import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Pool } from 'pg';
import { homeRoutes } from './routes/home';
import { userRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:securepassword@localhost:5432/ecommerce';
const pool = new Pool({ connectionString });

// Self-Healing: Automatically initialize both tables on startup
try {
  // Create products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  
  console.log("Database tables initialized successfully.");
} catch (error) {
  console.error("Failed to initialize database tables:", error);
}

const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'healthy', timestamp: new Date().toISOString() }))
  .use(homeRoutes)
  .use(userRoutes)
  .use(adminRoutes)
  .listen(3000);

console.log(`API Server is running at http://${app.server?.hostname}:${app.server?.port}`);