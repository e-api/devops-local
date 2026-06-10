import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Pool } from 'pg';
import { homeRoutes } from './routes/home';
import { userRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';
import { orderRoutes } from './routes/orders'; // 1. Added import

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:securepassword@localhost:5432/ecommerce';
const pool = new Pool({ connectionString });

// Self-Healing: Automatically initialize all 4 tables on startup
try {
  // 1. Create products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `);

  // 2. Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // 3. Create orders table (References Users)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      total DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // 4. Create order items table (References Orders & Products)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) NOT NULL,
      product_id INTEGER REFERENCES products(id) NOT NULL,
      quantity INTEGER NOT NULL,
      price DOUBLE PRECISION NOT NULL
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
  .use(orderRoutes) // 2. Added route registration
  .listen(3000);

console.log(`API Server is running at http://${app.server?.hostname}:${app.server?.port}`);