import { Elysia, t } from 'elysia';

export const adminRoutes = new Elysia({ prefix: '/api/admin' })
  .get('/dashboard', () => {
    return {
      totalSales: 15420.50,
      activeUsers: 342,
      lowStockAlerts: 3
    };
  })
  .post('/products', ({ body }) => {
    return { message: "Product created successfully", product: body };
  }, {
    body: t.Object({
      name: t.String(),
      price: t.Number(),
      stock: t.Number()
    })
  });