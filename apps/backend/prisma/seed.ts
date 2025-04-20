import { prisma } from '../utils/prisma';

async function main() {
  const password = 'password';
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: 'argon2d',
  });
  // create a new user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const userPromises = [];
  for (let i = 1; i <= 10; i++) {
    const email = `testuser${i}@example.com`;
    const name = `Test User ${i}`;
    userPromises.push(
      prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
          name: name,
          email: email,
          password: hashedPassword,
          role: 'USER', // Assuming these are regular users
        },
      })
    );
  }
  const additionalUsers = await Promise.all(userPromises);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`User created: ${user.email}`);
  console.log(`Admin created: ${admin.email}`);
  console.log(`Created/found ${additionalUsers.length} additional users.`);

  const now = new Date();
  const eventsData = [
    // --- Tech Events (5) ---
    {
      name: 'Future of AI Summit',
      description: 'Explore the latest advancements in Artificial Intelligence.',
      startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 hours duration
      venue: 'Innovation Hub Center',
      maxTickets: 250,
    },
    {
      name: 'Web Dev Workshop: Next.js Deep Dive',
      description: 'Hands-on workshop focusing on advanced Next.js features.',
      startTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      endTime: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours duration
      venue: 'Tech Training Institute',
      maxTickets: 50,
    },
    {
      name: 'Cybersecurity Trends 2024',
      description: 'Panel discussion on emerging cybersecurity threats and solutions.',
      startTime: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      endTime: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
      venue: 'SecureTech Conference Hall',
      maxTickets: 150,
    },
    {
      name: 'Cloud Computing Expo',
      description: 'Showcasing the latest in cloud technology and services.',
      startTime: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      endTime: new Date(now.getTime() + 26 * 24 * 60 * 60 * 1000), // 1 day duration
      venue: 'Expo Center Downtown',
      maxTickets: 800,
    },
    {
      name: 'Intro to Quantum Computing',
      description: 'Beginner-friendly session on the principles of quantum computing.',
      startTime: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      endTime: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      venue: 'University Science Auditorium',
      maxTickets: 100,
    },
    // --- Work From Cafe Events (5) ---
    {
      name: 'Freelancer Friday @ The Daily Grind',
      description: 'Casual co-working session for freelancers and remote workers.',
      startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // Next Friday 9 AM
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // Until 5 PM
      venue: 'The Daily Grind Cafe',
      maxTickets: 30, // Limited space
    },
    {
      name: 'Code & Coffee Morning',
      description: 'Informal gathering for developers to work and chat.',
      startTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 8 days from now, 10 AM
      endTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // Until 1 PM
      venue: 'Artisan Roast Hub',
      maxTickets: 25,
    },
    {
      name: 'Quiet Work Wednesday',
      description: 'Designated quiet zone for focused work over coffee.',
      startTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 12 days from now, 1 PM
      endTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // Until 5 PM
      venue: 'The Study Cafe',
      maxTickets: 20,
    },
    {
      name: 'Remote Workers Meetup',
      description: 'Networking and co-working for the remote community.',
      startTime: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 18 days from now, 2 PM
      endTime: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // Until 6 PM
      venue: 'Central Perk Cafe',
      maxTickets: 40,
    },
    {
      name: 'Laptop Warriors Lunch',
      description: 'Combine lunch with a productive work session.',
      startTime: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), // 22 days from now, 12 PM
      endTime: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // Until 2 PM
      venue: 'Gourmet Grind Eatery',
      maxTickets: 35,
    },
    // --- Reading Book Club Events (5) ---
    {
      name: 'Sci-Fi Readers Circle',
      description: 'Discussing "Dune" by Frank Herbert.',
      startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // 7 days from now, 7 PM
      endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000), // Until 9 PM
      venue: 'Community Library Room B',
      maxTickets: 20,
    },
    {
      name: 'Mystery & Thriller Book Club',
      description: 'This month\'s read: "The Silent Patient".',
      startTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 14 days from now, 6 PM
      endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // Until 8 PM
      venue: 'The Cozy Corner Bookstore',
      maxTickets: 15,
    },
    {
      name: 'Contemporary Fiction Group',
      description: 'Discussion of "Klara and the Sun".',
      startTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 19 * 30 * 60 * 1000), // 21 days from now, 7:30 PM
      endTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 21 * 30 * 60 * 1000), // Until 9:30 PM
      venue: 'Literary Lounge Cafe',
      maxTickets: 25,
    },
    {
      name: 'Historical Novel Society',
      description: 'Focus on "Wolf Hall" this session.',
      startTime: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 28 days from now, 6 PM
      endTime: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // Until 8 PM
      venue: 'History Museum Reading Room',
      maxTickets: 18,
    },
    {
      name: 'Poetry Appreciation Night',
      description: 'Sharing and discussing favorite poems. Theme: Nature.',
      startTime: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 32 days from now, 8 PM
      endTime: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000), // Until 9 PM
      venue: "The Poet's Nook",
      maxTickets: 30,
    },
  ];

  const eventPromises = eventsData.map(eventData => {
    return prisma.event.upsert({
      where: { name: eventData.name }, // Use name as unique identifier for seeding
      update: {}, // No specific fields to update if event exists
      create: eventData,
    });
  });

  const createdEvents = await Promise.all(eventPromises);
  console.log(`Created/found ${createdEvents.length} events.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
