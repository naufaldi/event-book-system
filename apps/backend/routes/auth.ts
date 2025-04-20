import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'hono/jwt';
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
  async c => {
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

      const payload = {
        userId: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
      };

      const token = await sign(payload, process.env.JWT_SECRET || 'your-secret-key');

      return c.json({ ...user, token }, 201);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
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
  async c => {
    const { email, password: plainTextPassword } = c.req.valid('json');

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

    if (!user) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const isPasswordValid = await Bun.password.verify(plainTextPassword, user.password);

    if (!isPasswordValid) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const payload = {
      userId: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
    };

    const token = await sign(
      payload,
      process.env.JWT_SECRET ||
        'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJFdmVudEJvb2tpbmciLCJVc2VybmFtZSI6IkV2ZW50Qm9va2luZ0FwcCIsImV4cCI6MTcxNjIzOTAyMn0.8C9EMiPS3oUOgV_jHn1X9E4KNGJbCVGaJ5aYCKJgQZA'
    );

    const { password: _, ...userWithoutPassword } = user;
    return c.json({ ...userWithoutPassword, token }, 200);
  }
);

// GET /auth/me
authRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/me',
    tags: ['Users'],
    summary: 'Get user details',
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        authorization: z.string().describe('Bearer token'),
      }),
    },
    responses: {
      200: {
        description: 'User details retrieved successfully',
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
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
  async c => {
    // Get the authorization header (note: Hono is case-insensitive for headers)
    // In the implementation, ensure it handles both formats
    const authHeader = c.req.header('authorization') || c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    try {
      const decoded = (await verify(token, process.env.JWT_SECRET || 'your-secret-key')) as {
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
        return c.json({ error: 'User not found' }, 401);
      }

      return c.json({ ...user, token }, 200);
    } catch (error) {
      console.error('Token verification error:', error);
      return c.json({ error: 'Invalid token' }, 401);
    }
  }
);
