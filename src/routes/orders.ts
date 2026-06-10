import { Elysia, t } from 'elysia';
import { db } from '../db';
import { ordersTable, orderItemsTable, productsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const orderRoutes = new Elysia({ prefix: '/api/orders' })
  .post('/', async ({ body, set }) => {
    const { userId, items } = body;

    try {
      // Execute the order placement inside a secure Database Transaction
      const orderResult = await db.transaction(async (tx) => {
        let orderTotal = 0;
        const itemsToInsert = [];

        // 1. Loop through items to calculate total and check/update stock
        for (const item of items) {
          const [product] = await tx.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);

          if (!product) {
            tx.rollback(); // Cancel the transaction
            return { error: `Product ID ${item.productId} not found` };
          }

          if (product.stock < item.quantity) {
            tx.rollback(); // Cancel the transaction
            return { error: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` };
          }

          // Deduct stock
          await tx.update(productsTable)
            .set({ stock: product.stock - item.quantity })
            .where(eq(productsTable.id, product.id));

          orderTotal += product.price * item.quantity;
          itemsToInsert.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price // Save purchase-time price
          });
        }

        // 2. Create the Order Record
        const [newOrder] = await tx.insert(ordersTable).values({
          userId,
          total: orderTotal
        }).returning();

        if (!newOrder) {
          tx.rollback();
          return { error: "Failed to create order record" };
        }

        // 3. Create the Order Items Records
        const finalItems = itemsToInsert.map(item => ({
          ...item,
          orderId: newOrder.id
        }));

        await tx.insert(orderItemsTable).values(finalItems);

        return { success: true, orderId: newOrder.id, total: orderTotal };
      });

      if ('error' in orderResult) {
        set.status = 400;
        return { error: orderResult.error };
      }

      return orderResult;

    } catch (error: any) {
      set.status = 500;
      return { error: "Database transaction failed", details: error.message };
    }
  }, {
    body: t.Object({
      userId: t.Number(),
      items: t.Array(t.Object({
        productId: t.Number(),
        quantity: t.Number()
      }))
    })
  });