import { prisma } from './utils/prisma';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { rootRoute } from './routes/root';
import { swaggerUI } from '@hono/swagger-ui';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';

const app = new OpenAPIHono();

// config middleware
app.use(cors());
app.use(logger());

// define API Routes
app.route('/', rootRoute);
app.route('/auth', authRoutes);
app.route('/users', userRoutes);

app.get('/', (c) => c.text('Hello Bun!'));

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

// Add Swagger documentation
app.get('/swagger', swaggerUI({ url: '/docs' }));
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'Event Booking API',
    version: '1.0.0',
    description: 'API for Event Booking System',
  },
  servers: [{ url: 'http://localhost:3000' }]
});

export default {
  fetch: app.fetch,
  port: 3000,
};