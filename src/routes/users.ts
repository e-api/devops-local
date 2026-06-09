import { Elysia, t } from 'elysia';

export const userRoutes = new Elysia({ prefix: '/api/user' })
  .get('/profile', () => {
    return { username: "johndoe", email: "john@example.com", tier: "premium" };
  })
  .post('/cart', ({ body }) => {
    return { message: "Item added to cart", cart: body };
  }, {
    body: t.Object({
      productId: t.Number(),
      quantity: t.Number()
    })
  });