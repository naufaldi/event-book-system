import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
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
    responses: {
      200: {
        description: 'List of all users',
        content: {
          'application/json': {
            schema: z.array(userSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return c.json(users);
  }
);

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
        // Exclude password
      },
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json(user);
  }
);

// POST /users - Register a new user
userRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
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
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: userSchema,
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
          // Exclude password
        },
      });

      return c.json(user, 201);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        return c.json({ message: 'Email already exists' }, 400);
      }
      return c.json({ message: 'Failed to create user' }, 400);
    }
  }
);

// PUT /users/:id - Update user details
userRoutes.openapi(
  createRoute({
    method: 'put',
    path: '/:id',
    tags,
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
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
          // Exclude password
        },
      });

      return c.json(user);
    } catch (error) {
      return c.json({ message: 'User not found' }, 404);
    }
  }
);

// DELETE /users/:id - Delete a user
userRoutes.openapi(
  createRoute({
    method: 'delete',
    path: '/:id',
    tags,
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
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

    try {
      await prisma.user.delete({
        where: { id },
      });

      return c.json({ message: 'User deleted successfully' });
    } catch (error) {
      return c.json({ message: 'User not found' }, 404);
    }
  }
);
