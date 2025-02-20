
import { prisma } from './utils/prisma';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { rootRoute } from './routes/root';

const app = new OpenAPIHono();

// config middleware
app.use(cors());
app.use(logger());

// define API Routes
const apiRoutes = app
.basePath("/")
.route("/", rootRoute)


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

export default {
  fetch: app.fetch,
  port: 3001,
};

export type apiRoutes = typeof apiRoutes;