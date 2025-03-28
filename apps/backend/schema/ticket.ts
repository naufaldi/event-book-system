import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.number(),
  eventId: z.number(),
  userId: z.number(),
  seatNumber: z.string(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'CANCELLED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
