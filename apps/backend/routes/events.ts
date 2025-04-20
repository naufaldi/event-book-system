import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { createEventSchema, eventSchema } from '../schema/event';
import { prisma } from '../utils/prisma';

export const eventRoutes = new OpenAPIHono();

const tags = ['Events'];

// GET /events - List all upcoming events with search capabilities
eventRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags,
    summary: 'Get all upcoming events',
    description: 'Get all upcoming events with optional filtering by name, venue, or date',
    request: {
      query: z.object({
        name: z.string().optional(),
        venue: z.string().optional(),
        date: z.string().optional(),
        status: z.enum(['available', 'booked', 'all']).optional().default('all'),
      }),
    },
    responses: {
      200: {
        description: 'List of upcoming events',
        content: {
          'application/json': {
            schema: z.array(eventSchema),
          },
        },
      },
      400: {
        description: 'Invalid request parameters',
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
    // Extract query parameters
    const query = c.req.valid('query');
    const { name, venue, date, status } = query;
    const now = new Date();

    // Set up date filter
    let dateFilter = {};
    if (date) {
      try {
        // Parse date and create range for the entire day
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);

        dateFilter = {
          startTime: {
            gte: searchDate,
            lt: nextDay,
          },
        };
      } catch (error) {
        return c.json(
          {
            message: 'Invalid date format. Please use YYYY-MM-DD',
          },
          400
        );
      }
    } else {
      // Default to upcoming events
      dateFilter = {
        startTime: {
          gte: now,
        },
      };
    }

    // Build where clause with all filters
    const whereClause: any = {
      ...dateFilter,
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(venue && { venue: { contains: venue, mode: 'insensitive' } }),
    };

    // Query database with filters
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc',
      },
      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: 'BOOKED',
              },
            },
          },
        },
      },
    });

    // Calculate availability and apply status filter if needed
    const eventsWithAvailability = events
      .map(event => {
        const { _count, ...eventData } = event;
        const bookedTickets = _count.tickets;
        const availableTickets = event.maxTickets - bookedTickets;

        return {
          ...eventData,
          bookedTickets,
          availableTickets,
          availability: bookedTickets >= event.maxTickets ? 'sold out' : 'available',
        };
      })
      .filter(event => {
        // Apply status filter if provided
        if (status === 'available') {
          return event.availableTickets > 0;
        } else if (status === 'booked') {
          return event.availableTickets === 0;
        }
        // Return all events for 'all' status
        return true;
      });

    return c.json(eventsWithAvailability, 200);
  }
);

// GET event by ID
eventRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/:id',
    tags,
    summary: 'Get event details by ID',
    description: 'Returns detailed information about a specific event',
    request: {
      params: z.object({
        id: z.string().transform(val => parseInt(val, 10)),
      }),
    },
    responses: {
      200: {
        description: 'Event details',
        content: {
          'application/json': {
            schema: eventSchema.extend({
              bookedTickets: z.number(),
              availableTickets: z.number(),
              availability: z.enum(['sold out', 'available']),
            }),
          },
        },
      },
      404: {
        description: 'Event not found',
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
    const { id } = c.req.valid('param');

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: 'booked',
              },
            },
          },
        },
      },
    });

    if (!event) {
      return c.json({ message: 'Event not found' }, 404);
    }

    // Calculate availability
    const { _count, ...eventData } = event;
    const bookedTickets = _count.tickets;
    const availableTickets = event.maxTickets - bookedTickets;

    // format date for better readability
    const formattedStartTime = event.startTime.toISOString();
    const formattedEndTime = event.endTime.toISOString();

    return c.json(
      {
        ...eventData,
        bookedTickets,
        availableTickets,
        availability: bookedTickets >= event.maxTickets ? 'sold out' : 'available',
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      },
      200
    );
  }
);

// POST to create event (admin only)
eventRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags,
    security: [{ bearerAuth: [] }],
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
        description: 'Event created successfully',
        content: {
          'application/json': {
            schema: eventSchema,
          },
        },
      },
      400: {
        description: 'Invalid input',
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
