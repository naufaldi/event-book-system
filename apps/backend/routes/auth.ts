import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { createUserSchema, loginSchema, authResponseSchema } from '../schema/user';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();
const tags = ['Authentication'];

export const authRoutes = new OpenAPIHono();

// POST /auth/register
authRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/register',
    tags,
    request: {
      body: {
        content: {
          'application/json': {
            schema: createUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: {
          'application/json': {
            schema: authResponseSchema,
          },
        },
      },
      400: {
        description: 'Invalid input or email already exists',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const data = c.req.valid('json');

    try {
      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashPassword(data.password),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return c.json({ ...user, token }, 201);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        return c.json({ message: 'Email already exists' }, 400);
      }
      return c.json({ message: 'Failed to register user' }, 400);
    }
  }
);

// POST /auth/login
authRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    tags,
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: authResponseSchema,
          },
        },
      },
      401: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid('json');

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.password !== hashPassword(password)) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const token = sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return c.json({ ...userWithoutPassword, token });
  }
);

// GET /auth/me
authRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/me',
    tags,
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'User profile',
        content: {
          'application/json': {
            schema: authResponseSchema,
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
      return c.json({ message: 'No token provided' }, 401);
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        userId: number;
        role: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return c.json({ message: 'User not found' }, 401);
      }

      return c.json({ ...user, token });
    } catch (error) {
      return c.json({ message: 'Invalid token' }, 401);
    }
  }
); 