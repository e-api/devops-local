import { Elysia, t } from 'elysia';
import { db } from '../db';
import { productsTable } from '../db/schema';

export const homeRoutes = new Elysia({ prefix: '/api' })
  .get('/products', async () => {
    // Select all products from the postgres database
    return await db.select().from(productsTable);
  })
  .post('/products', async ({ body }) => {
    // Insert new product and return the inserted row
    const result = await db.insert(productsTable).values(body).returning();
    return { success: true, product: result[0] };
  }, {
    body: t.Object({
      name: t.String(),
      price: t.Number(),
      stock: t.Number()
    })
  });