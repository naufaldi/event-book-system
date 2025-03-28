import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import { verify } from 'hono/jwt';
import { createUserSchema, updateUserSchema, userSchema } from '../schema/user';
import { hashPassword } from '../utils/password';

const prisma = new PrismaClient();
const tags = ['Users'];


export const userRoutes = new OpenAPIHono();

// GET /users - List all users
userRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags,
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        authorization: z.string().describe("Bearer token"),
      }),
    },
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: z.array(userSchema),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    // Add token verification
    const authHeader = c.req.header('authorization') || c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    try {
      const decoded = await verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as {
        userId: number;
        role: string;
      };
      
      // Continue with existing logic after valid verification
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return c.json(users, 200);
    } catch (error) {
      // This will catch verification failures
      return c.json({ error: "Invalid token" }, 401);
    }
  }
);

// GET /users/:id - Get user by ID
userRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/:id',
    tags,
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
      }),
    },
    responses: {
      200: {
        description: 'User details',
        content: {
          'application/json': {
            schema: userSchema,
          },
        },
      },
      404: {
        description: 'User not found',
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
    const { id } = c.req.valid('param');

    const user = await prisma.user.findUnique({
      where: { id },
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
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json(user, 200);
  }
);



// PUT /users/:id - Update user details
userRoutes.openapi(
  createRoute({
    method: 'put',
    path: '/:id',
    tags,
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
      }),
      headers: z.object({
        authorization: z.string().describe("Bearer token"),
      }),
      body: {
        content: {
          'application/json': {
            schema: updateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User updated successfully',
        content: {
          'application/json': {
            schema: userSchema,
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
      404: {
        description: 'User not found',
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
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');

    // Verify JWT token
    const authHeader = c.req.header('authorization') || c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    try {
      const decoded = await verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as {
        userId: number;
        role: string;
      };

      // Check if user has permission (admin or same user)
      if (decoded.role !== 'admin' && decoded.userId !== id) {
        return c.json({ error: "Unauthorized to modify this user" }, 401);
      }

      // If password is provided, hash it
      const updateData = data.password
        ? { ...data, password: hashPassword(data.password) }
        : data;

      try {
        const user = await prisma.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return c.json(user, 200);
      } catch (dbError) {
        return c.json({ message: 'User not found' }, 404);
      }
    } catch (error) {
      // Handle JWT verification errors
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: "Invalid token" }, 401);
        }
      }
      return c.json({ error: "Authentication failed" }, 401);
    }
  }
);

// DELETE /users/:id - Delete a user
userRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/:id',
    tags,
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
      }),
      headers: z.object({
        authorization: z.string().describe("Bearer token"),
      }),
    },
    responses: {
      200: {
        description: 'User deleted successfully',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
            }),
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
      404: {
        description: 'User not found',
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
    const { id } = c.req.valid('param');

    // Verify JWT token
    const authHeader = c.req.header('authorization') || c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    try {
      const decoded = await verify(
        token, 
        process.env.JWT_SECRET || 'your-secret-key'
      ) as {
        userId: number;
        role: string;
      };

      // Only admins can delete users (or users can delete themselves)
      if (decoded.role !== 'admin' && decoded.userId !== id) {
        return c.json({ error: "Unauthorized to delete this user" }, 401);
      }

      try {
        await prisma.user.delete({
          where: { id },
        });
        return c.json({ message: 'User deleted successfully' }, 200);
      } catch (dbError) {
        return c.json({ message: 'User not found' }, 404);
      }
    } catch (error) {
      // Handle JWT verification errors
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: "Invalid token" }, 401);
        }
      }
      return c.json({ error: "Authentication failed" }, 401);
    }
  }
);
