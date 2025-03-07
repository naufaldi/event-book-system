import { z } from 'zod';

export const eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  venue: z.string().min(1, 'Venue is required'),
});
