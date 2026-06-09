import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { homeRoutes } from './routes/home';
import { userRoutes } from './routes/users';
import { adminRoutes } from './routes/admin';

const app = new Elysia()
  .use(cors())
  // Basic health check endpoint (essential for DevOps/monitoring later)
  .get('/health', () => ({ status: 'healthy', version: '1.0.1', timestamp: new Date().toISOString() }))
  // Register our grouped routes
  .use(homeRoutes)
  .use(userRoutes)
  .use(adminRoutes)
  .listen(3000);

console.log(`API Server is running at http://${app.server?.hostname}:${app.server?.port}`);