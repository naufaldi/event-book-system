import { z } from 'zod';

export const ReservationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];

export const reservationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  eventId: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Reservation = z.infer<typeof reservationSchema>;

// Only eventId is required from the user - userId will come from authentication
export const createReservationSchema = z.object({
  eventId: z.number(),
});

export type CreateReservation = z.infer<typeof createReservationSchema>;
