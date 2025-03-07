import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { createEventSchema, eventSchema } from '../schema/event';
import { prisma } from '../utils/prisma';

export const eventroutes = new OpenAPIHono();

eventroutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Events'],
    request: {
      params: z.object({
        id: z.string().transform((val) => parseInt(val, 10)),
      }),
    },
    responses: {
      200: {
        description: 'Events Details',
        content: {
          'application/json': {
            schema: eventSchema,
          },
        },
      },
      404: {
        description: 'event not found',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              code: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
    });
    if (!event) {
      return c.json({
        message: 'Event not found',
      });
    }
    return c.json(event);
  }
);

eventroutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags,
    request: {
      body: {
        content: {
          'application/json': {
            schema: createEventSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'event created successfully',
        content: {
          'application/json': {
            schema: eventSchema,
          },
        },
      },
      400: {
        description: 'Bad Request',
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
      const event = await prisma.event.create({
        data,
      });
      return c.json(event, 201);
    } catch (error) {
      return c.json(
        {
          message: 'Failed to create event',
        },
        400
      );
    }
  }
);
