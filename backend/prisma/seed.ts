import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create interests
  const interests = [
    { name: 'Dancing' },
    { name: 'Music' },
    { name: 'Art' },
    { name: 'Sports' },
    { name: 'Technology' },
    { name: 'Food' },
    { name: 'Travel' },
    { name: 'Photography' },
    { name: 'Reading' },
    { name: 'Writing' },
  ];

  for (const interest of interests) {
    await prisma.interest.upsert({
      where: { name: interest.name },
      update: {},
      create: interest,
    });
  }

  // Create tags
  const tags = [
    { name: 'Dancing' },
    { name: 'Music' },
    { name: 'Art' },
    { name: 'Sports' },
    { name: 'Technology' },
    { name: 'Food' },
    { name: 'Travel' },
    { name: 'Photography' },
    { name: 'Reading' },
    { name: 'Writing' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  // Delete all existing events
  await prisma.rSVP.deleteMany({});
  await prisma.event.deleteMany({});

  // Get users and interests for creating events
  const users = await prisma.user.findMany({
    include: { interests: true }
  });
  
  const allInterests = await prisma.interest.findMany();
  const allTags = await prisma.tag.findMany();

  if (users.length === 0) {
    console.log('No users found. Please create users first.');
    return;
  }

  // Create realistic events
  const events = [
    {
      title: 'Salsa Night at El Corazón',
      description: 'Join us for an unforgettable evening of salsa dancing! Whether you\'re a beginner or an experienced dancer, come and enjoy the rhythm of Latin music. Professional instructors will be available for free lessons from 7-8 PM.',
      date: new Date('2025-01-15T19:00:00Z'),
      location: 'El Corazón Dance Studio, 123 Salsa Street, Miami, FL',
      tags: ['Dancing', 'Music']
    },
    {
      title: 'Tech Meetup: AI and Machine Learning',
      description: 'Explore the latest trends in artificial intelligence and machine learning. Network with fellow tech enthusiasts, attend presentations by industry experts, and participate in hands-on workshops. Light refreshments will be provided.',
      date: new Date('2025-01-20T18:30:00Z'),
      location: 'Innovation Hub, 456 Tech Avenue, San Francisco, CA',
      tags: ['Technology']
    },
    {
      title: 'Photography Walk: Golden Gate Bridge',
      description: 'Capture the beauty of San Francisco\'s iconic Golden Gate Bridge during golden hour. This guided photography walk is perfect for photographers of all skill levels. Bring your camera and learn composition techniques from professional photographers.',
      date: new Date('2025-01-25T16:00:00Z'),
      location: 'Crissy Field, San Francisco, CA',
      tags: ['Photography', 'Travel']
    },
    {
      title: 'Gourmet Food Festival',
      description: 'Indulge in a culinary adventure featuring local chefs, food trucks, and artisanal vendors. Sample diverse cuisines, attend cooking demonstrations, and enjoy live music. Family-friendly event with activities for all ages.',
      date: new Date('2025-02-01T11:00:00Z'),
      location: 'Central Park, New York, NY',
      tags: ['Food', 'Music']
    },
    {
      title: 'Book Club: Modern Literature Discussion',
      description: 'Join our monthly book club discussion featuring contemporary fiction. This month we\'re discussing "The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid. New members welcome! Coffee and pastries provided.',
      date: new Date('2025-02-05T14:00:00Z'),
      location: 'Cozy Corner Bookstore, 789 Literary Lane, Portland, OR',
      tags: ['Reading', 'Writing']
    },
    {
      title: 'Basketball Tournament: 3v3 Street Ball',
      description: 'Show off your basketball skills in our exciting 3v3 tournament! Open to all skill levels with separate divisions for beginners and advanced players. Prizes for winning teams and MVP awards. Registration includes team t-shirt.',
      date: new Date('2025-02-10T09:00:00Z'),
      location: 'Venice Beach Basketball Courts, Los Angeles, CA',
      tags: ['Sports']
    },
    {
      title: 'Art Gallery Opening: Local Artists Showcase',
      description: 'Celebrate local talent at our quarterly art showcase featuring paintings, sculptures, and digital art from emerging artists. Meet the artists, enjoy wine and cheese, and discover unique pieces for your collection.',
      date: new Date('2025-02-14T18:00:00Z'),
      location: 'Modern Art Gallery, 321 Creative Boulevard, Austin, TX',
      tags: ['Art']
    },
    {
      title: 'Hiking Adventure: Mountain Trail Exploration',
      description: 'Embark on a scenic 5-mile hike through beautiful mountain trails. Suitable for intermediate hikers. Enjoy breathtaking views, wildlife spotting, and fresh mountain air. Bring water, snacks, and comfortable hiking boots.',
      date: new Date('2025-02-18T08:00:00Z'),
      location: 'Rocky Mountain National Park, Colorado',
      tags: ['Travel', 'Sports']
    },
    {
      title: 'Jazz Night: Live Music & Dancing',
      description: 'Experience the smooth sounds of jazz with live performances by local musicians. Dance floor open for swing dancing with optional lessons at 7 PM. Craft cocktails and appetizers available. Dress code: smart casual.',
      date: new Date('2025-02-22T19:30:00Z'),
      location: 'Blue Note Jazz Club, 654 Music Row, Nashville, TN',
      tags: ['Music', 'Dancing']
    },
    {
      title: 'Creative Writing Workshop',
      description: 'Unleash your creativity in this hands-on writing workshop. Learn techniques for character development, plot structure, and dialogue. Suitable for beginners and experienced writers. Small group setting ensures personalized feedback.',
      date: new Date('2025-02-28T13:00:00Z'),
      location: 'Writers\' Retreat Center, 987 Inspiration Drive, Seattle, WA',
      tags: ['Writing', 'Reading']
    }
  ];

  // Create events with random organizers
  for (const eventData of events) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const eventTags = allTags.filter(tag => eventData.tags.includes(tag.name));
    
    await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        creatorId: randomUser.id,
        tags: {
          connect: eventTags.map(tag => ({ id: tag.id }))
        }
      }
    });
  }

  console.log('Seed data created successfully with realistic events');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });