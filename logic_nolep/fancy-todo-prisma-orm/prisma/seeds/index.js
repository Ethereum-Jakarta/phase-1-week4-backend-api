const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  try {
    const user1 = await prisma.user.create({
      data: {
        name: 'Fitra',
        email: 'fitra@gmail.com',
        phone: '1234567890',
        todos: {
          create: [
            {
              title: 'Learn Prisma',
              description: 'Study Prisma documentation and tutorials',
              status: 'in-progress',
            },
            {
              title: 'Build a project',
              description: 'Create a full-stack app with Prisma',
              status: 'pending',
            },
          ],
        },
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Ilyasa',
        email: 'ilyasa@gmail.com',
        phone: '0987654321',
        todos: {
          create: [
            {
              title: 'Learn GraphQL',
              description: 'Understand how GraphQL works and integrate it with Prisma',
              status: 'completed',
            },
          ],
        },
      },
    });

    console.log('Seed data created:', { user1, user2 });
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
