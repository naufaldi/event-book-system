import { prisma } from './utils/prisma';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { rootRoute } from './routes/root';
import { swaggerUI } from '@hono/swagger-ui';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { eventRoutes } from './routes/events';

// Create the app instance
const app = new OpenAPIHono();

// Register the security scheme in the registry
app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter JWT token',
});

// Apply middleware using type assertions to bypass type errors
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }) as any
);
app.use(logger() as any);

// Define API Routes
app.route('/', rootRoute);
app.route('/auth', authRoutes);
app.route('/users', userRoutes);
app.route('/events', eventRoutes);

app.get('/', c => c.text('Hello Bun!'));

// Create Event
app.post('/events', async c => {
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

app.get('/events', async c => {
  const events = await prisma.event.findMany();
  return c.json(events);
});

// Add Swagger documentation
app.get(
  '/swagger',
  swaggerUI({
    url: '/docs',
    defaultModelsExpandDepth: -1,
    persistAuthorization: true,
  })
);

// Use a dynamic configuration to access server URL
app.doc('/docs', c => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Event Booking API',
      version: '1.0.0',
      description: 'API for Event Booking System',
    },
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: 'Current environment',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
});

export default {
  fetch: app.fetch,
  port: 3000,
};
