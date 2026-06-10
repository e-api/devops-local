import { Elysia, t } from 'elysia';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const userRoutes = new Elysia({ prefix: '/api/user' })
  .post('/register', async ({ body, set }) => {
    const { email, password } = body;

    try {
      // 1. Check if user already exists
      const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      
      if (existingUser.length > 0) {
        set.status = 400;
        return { error: "User with this email already exists" };
      }

      // 2. Hash the password securely using Bun's native utility
      const passwordHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      // 3. Insert user into the database
      const result = await db.insert(usersTable).values({
        email,
        passwordHash,
      }).returning();

      // Type-safe check: Extract the first element safely
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
  });