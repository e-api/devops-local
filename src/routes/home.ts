import { Elysia } from 'elysia';

export const homeRoutes = new Elysia({ prefix: '/api' })
  .get('/products', () => {
    return [
      { id: 1, name: "Wireless Mouse", price: 29.99 },
      { id: 2, name: "Mechanical Keyboard", price: 79.99 },
      { id: 3, name: "USB-C Hub", price: 19.99 }
    ];
  })
  .get('/products/:id', ({ params: { id } }) => {
    return { id: Number(id), name: "Sample Product", price: 29.99, description: "Detailed description of product." };
  });
