import { z } from 'zod';

export const reservationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  eventId: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Only eventId is required from the user - userId will come from authentication
export const createReservationSchema = z.object({
  eventId: z.number(),
});
