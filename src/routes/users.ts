import { Elysia, t } from 'elysia';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userRoutes = new Elysia({ prefix: '/api/user' })
  .post('/register', async ({ body, set }) => {
    const { email, password } = body;

    try {
      const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        set.status = 400;
        return { error: "User with this email already exists" };
      }

      const passwordHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const result = await db.insert(usersTable).values({
        email,
        passwordHash,
      }).returning();

      const newUser = result[0];
      if (!newUser) {
        set.status = 500;
        return { error: "Database failed to return the registered user" };
      }

      return { 
        success: true, 
        message: "User registered successfully", 
        userId: newUser.id 
      };
    } catch (error: any) {
      set.status = 500;
      return { error: "Database error during registration", details: error.message };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 })
    })
  })

  .post('/login', async ({ body, set }) => {
    const { email, password } = body;

    try {
      const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      const user = result[0];

      if (!user) {
        set.status = 404;
        return { error: "User not found" };
      }

      const isPasswordValid = await Bun.password.verify(password, user.passwordHash);

      if (!isPasswordValid) {
        set.status = 401;
        return { error: "Invalid password" };
      }

      return { 
        success: true, 
        message: "Login successful", 
        userId: user.id 
      };
    } catch (error: any) {
      set.status = 500;
      return { error: "Database error during login", details: error.message };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    })
  });