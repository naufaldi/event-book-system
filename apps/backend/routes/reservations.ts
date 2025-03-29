// apps/backend/routes/reservations.ts
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { reservationSchema, ReservationStatus } from '../schema/reservation';
import { prisma } from '../utils/prisma';
import { verify } from 'hono/jwt';
import { eventSchema } from '../schema/event';
import { ticketSchema, TicketStatus } from '../schema/ticket';

export const reservationRoutes = new OpenAPIHono();

const tags = ['Reservations'];

// Create reservation schema
const createReservationSchema = z.object({
  eventId: z.number(),
});

// POST to create a reservation
reservationRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags,
    security: [{ bearerAuth: [] }],
    summary: 'Make a reservation for an event',
    description: 'Creates a new reservation for an event if tickets are available',
    request: {
      headers: z.object({
        authorization: z.string().describe('Bearer token'),
      }),
      body: {
        content: {
          'application/json': {
            schema: createReservationSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Reservation created successfully',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              reservation: reservationSchema,
              ticket: ticketSchema,
            }),
          },
        },
      },
      400: {
        description: 'Invalid input or no tickets available',
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
    // Extract JWT token from authorization header
    const authHeader = c.req.header('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    try {
      // Verify the token and extract userId
      const decoded = (await verify(token, process.env.JWT_SECRET || 'your-secret-key')) as {
        userId: number;
        role: string;
      };

      const userId = decoded.userId;
      const { eventId } = c.req.valid('json');

      // 1. Check if event exists and has available tickets
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: {
              tickets: {
                where: {
                  status: TicketStatus.AVAILABLE,
                },
              },
            },
          },
        },
      });

      if (!event) {
        return c.json({ message: 'Event not found' }, 404);
      }

      const availableTickets = event._count.tickets;

      if (availableTickets === 0) {
        // If no available tickets
        return c.json({ message: 'No tickets available for this event' }, 400);
      }

      // 3. Create reservation (automatically confirmed)
      const reservation = await prisma.reservation.create({
        data: {
          userId,
          eventId,
          status: ReservationStatus.CONFIRMED,
        },
      });
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
      const seatNumber = `${formattedDate}-${userId}-${availableTickets + 1}`; // Format: YYYYMMDD-USERID-SEATNUMBER

      // 4. Create a ticket associated with this reservation
      const ticket = await prisma.ticket.create({
        data: {
          eventId,
          userId,
          status: TicketStatus.BOOKED,
          seatNumber, // Will look like: "20240328-123-1" (date-userId-seatNumber)
        },
      });

      return c.json(
        {
          message: 'Your reservation has been confirmed successfully!',
          reservation,
          ticket,
        },
        201
      );
    } catch (error) {
      // Handle JWT verification errors
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: 'Invalid token' }, 401);
        }
      }

      console.error('Reservation creation error:', error);
      return c.json(
        {
          message: 'Failed to create reservation',
        },
        400
      );
    }
  }
);

// GET user's reservations
reservationRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/my-reservations',
    tags,
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        authorization: z.string().describe('Bearer token'),
      }),
    },
    responses: {
      200: {
        description: 'List of user reservations',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.number(),
                userId: z.number(),
                eventId: z.number(),
                status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
                event: eventSchema,
                tickets: z.array(
                  z.object({
                    id: z.number(),
                    eventId: z.number(),
                    userId: z.number(),
                    seatNumber: z.string(),
                    status: z.enum(['AVAILABLE', 'BOOKED', 'CANCELLED']),
                    createdAt: z.string().datetime(),
                    updatedAt: z.string().datetime(),
                  })
                ),
              })
            ),
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
      500: {
        description: 'Internal Server Error',
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
    const authHeader = c.req.header('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    try {
      const decoded = (await verify(token, process.env.JWT_SECRET || 'your-secret-key')) as {
        userId: number;
        role: string;
      };

      const reservations = await prisma.reservation.findMany({
        where: {
          userId: decoded.userId,
        },
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Fetch tickets for these reservations
      const tickets = await prisma.ticket.findMany({
        where: {
          userId: decoded.userId,
          eventId: {
            in: reservations.map(r => r.eventId),
          },
        },
      });

      // Combine reservations with their tickets
      const reservationsWithTickets = reservations.map(reservation => ({
        ...reservation,
        tickets: tickets.filter(ticket => ticket.eventId === reservation.eventId),
      }));

      return c.json(reservationsWithTickets, 200);
    } catch (error) {
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: 'Invalid token' }, 401);
        }
      }
      return c.json({ error: 'Failed to fetch reservations' }, 500);
    }
  }
);

// PUT to cancel a reservation
reservationRoutes.openapi(
  createRoute({
    method: 'put',
    path: '/:id/cancel',
    tags,
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        authorization: z.string().describe('Bearer token'),
      }),
      params: z.object({
        id: z.string().describe('Reservation ID'),
      }),
    },
    responses: {
      200: {
        description: 'Reservation cancelled successfully',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              reservation: reservationSchema,
            }),
          },
        },
      },
      400: {
        description: 'Bad Request - Reservation already cancelled',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
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
      403: {
        description: 'Forbidden - User does not own this reservation',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
      404: {
        description: 'Reservation not found',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
      500: {
        description: 'Internal Server Error',
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
    const authHeader = c.req.header('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    try {
      // Verify the token and extract userId
      const decoded = (await verify(token, process.env.JWT_SECRET || 'your-secret-key')) as {
        userId: number;
        role: string;
      };

      const userId = decoded.userId;
      const reservationId = parseInt(c.req.param('id'));

      // Find the reservation
      const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        return c.json({ error: 'Reservation not found' }, 404);
      }

      // Check if the user owns this reservation
      if (reservation.userId !== userId) {
        return c.json({ error: 'You do not have permission to cancel this reservation' }, 403);
      }

      // Check if the reservation is already cancelled
      if (reservation.status === ReservationStatus.CANCELLED) {
        return c.json({ error: 'Reservation is already cancelled' }, 400);
      }

      // Update reservation status to cancelled
      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.CANCELLED,
        },
      });

      // Update associated ticket status to cancelled
      await prisma.ticket.updateMany({
        where: {
          eventId: reservation.eventId,
          userId: userId,
        },
        data: {
          status: TicketStatus.CANCELLED,
        },
      });

      return c.json(
        {
          message: 'Reservation cancelled successfully',
          reservation: updatedReservation,
        },
        200
      );
    } catch (error) {
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: 'Invalid token' }, 401);
        }
      }
      console.error('Reservation cancellation error:', error);
      return c.json({ error: 'Failed to cancel reservation' }, 500);
    }
  }
);

// GET user's tickets for upcoming events
reservationRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/my-tickets',
    tags,
    security: [{ bearerAuth: [] }],
    summary: 'Get user tickets for upcoming events',
    description: 'Returns all tickets for upcoming events that belong to the authenticated user',
    request: {
      headers: z.object({
        authorization: z.string().describe('Bearer token'),
      }),
    },
    responses: {
      200: {
        description: 'List of user tickets for upcoming events',
        content: {
          'application/json': {
            schema: z.array(
              z.object({
                id: z.number(),
                eventId: z.number(),
                userId: z.number(),
                seatNumber: z.string(),
                status: z.enum(['AVAILABLE', 'BOOKED', 'CANCELLED']),
                createdAt: z.string().datetime(),
                updatedAt: z.string().datetime(),
                event: eventSchema,
              })
            ),
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
      500: {
        description: 'Internal Server Error',
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
    const authHeader = c.req.header('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }

    try {
      const decoded = (await verify(token, process.env.JWT_SECRET || 'your-secret-key')) as {
        userId: number;
        role: string;
      };

      const now = new Date();

      // Get all tickets for the user where the event is upcoming
      const tickets = await prisma.ticket.findMany({
        where: {
          userId: decoded.userId,
          event: {
            startTime: {
              gt: now,
            },
          },
        },
        include: {
          event: true,
        },
        orderBy: {
          event: {
            startTime: 'asc',
          },
        },
      });

      return c.json(tickets, 200);
    } catch (error) {
      if (typeof error === 'object' && error !== null) {
        const err = error as Error;
        if (err.message && (err.message === 'jwt expired' || err.message.includes('token'))) {
          return c.json({ error: 'Invalid token' }, 401);
        }
      }
      return c.json({ error: 'Failed to fetch tickets' }, 500);
    }
  }
);

export default reservationRoutes;
