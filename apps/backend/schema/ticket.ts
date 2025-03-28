import { z } from 'zod';

export const TicketStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  CANCELLED: 'CANCELLED',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const ticketSchema = z.object({
  id: z.number(),
  eventId: z.number(),
  userId: z.number(),
  seatNumber: z.string(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'CANCELLED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Ticket = z.infer<typeof ticketSchema>;
