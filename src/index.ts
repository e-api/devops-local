import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Pool } from 'pg';
import { homeRoutes } from './routes/home';
import { userRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:securepassword@localhost:5432/ecommerce';
const pool = new Pool({ connectionString });

// Self-Healing: Automatically create the table if it does not exist on startup
try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.log("Database tables initialized successfully.");
} catch (error) {
  console.error("Failed to initialize database tables:", error);
}

const app = new Elysia()
  .use(cors())
  
  // Basic health check
  .get('/health', () => ({ status: 'healthy', timestamp: new Date().toISOString() }))

  .use(homeRoutes)
  .use(userRoutes)
  .use(adminRoutes)
  .listen(3000);

console.log(`API Server is running at http://${app.server?.hostname}:${app.server?.port}`);