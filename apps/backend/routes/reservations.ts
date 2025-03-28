// apps/backend/routes/reservations.ts
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { reservationSchema } from '../schema/reservation';
import { prisma } from '../utils/prisma';
import { verify } from 'hono/jwt';

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
    const authHeader = c.req.header('authorization') || c.req.header('Authorization');
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
                  status: 'available',
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
          status: 'confirmed',
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
          status: 'booked',
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

export default reservationRoutes;
