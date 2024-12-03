import { Hono } from 'hono';
import { prisma } from './utils/prisma';

const app = new Hono();

// create Event
app.post('/events', async (c) => {
  const { name, description, startTime, endTime, venue } = await c.req.json();
  const event = await prisma.event.create({
    data: {
      name,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      venue,
    },
  });
  return c.json(event);
});

app.get('/events', async (c) => {
  const events = await prisma.event.findMany();
  return c.json(events);
});

export default {
  fetch: app.fetch,
  port: 3001,
};
