/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { prisma } from './lib/prisma';

async function seed() {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.murmurLike.deleteMany();
    await prisma.murmur.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    const alice = await prisma.user.create({
      data: {
        username: 'alice',
        displayName: 'Alice Johnson',
        email: 'alice@example.com',
        passwordHash: 'hashed_password_1',
      },
    });

    const bob = await prisma.user.create({
      data: {
        username: 'bob',
        displayName: 'Bob Smith',
        email: 'bob@example.com',
        passwordHash: 'hashed_password_2',
      },
    });

    const charlie = await prisma.user.create({
      data: {
        username: 'charlie',
        displayName: 'Charlie Brown',
        email: 'charlie@example.com',
        passwordHash: 'hashed_password_3',
      },
    });

    const diana = await prisma.user.create({
      data: {
        username: 'diana',
        displayName: 'Diana Prince',
        email: 'diana@example.com',
        passwordHash: 'hashed_password_4',
      },
    });

    console.log('Users created successfully!');

    // Create follow relationships
    console.log('Creating follow relationships...');
    await prisma.follow.createMany({
      data: [
        { followerId: alice.id, followingId: bob.id },
        { followerId: alice.id, followingId: charlie.id },
        { followerId: bob.id, followingId: alice.id },
        { followerId: bob.id, followingId: diana.id },
        { followerId: charlie.id, followingId: alice.id },
        { followerId: charlie.id, followingId: bob.id },
      ],
    });

    console.log('Follow relationships created!');

    // Create murmurs
    console.log('Creating murmurs...');
    const murmur1 = await prisma.murmur.create({
      data: {
        userId: alice.id,
        content: 'Hello from Alice! This is my first murmur.',
      },
    });

    const murmur2 = await prisma.murmur.create({
      data: {
        userId: bob.id,
        content: 'Bob here! Having a great day coding with NestJS.',
      },
    });

    const murmur3 = await prisma.murmur.create({
      data: {
        userId: charlie.id,
        content: 'Charlie checking in. TypeScript is awesome!',
      },
    });

    const murmur4 = await prisma.murmur.create({
      data: {
        userId: alice.id,
        content: 'Just deployed my new app to production! 🚀',
      },
    });

    await prisma.murmur.create({
      data: {
        userId: diana.id,
        content: 'Diana here! Learning about microservices architecture.',
      },
    });

    const murmur6 = await prisma.murmur.create({
      data: {
        userId: bob.id,
        content:
          'Debugging is like being a detective in a crime movie where you are also the murderer.',
      },
    });

    await prisma.murmur.create({
      data: {
        userId: alice.id,
        content: 'Working on the weekend? More like working FOR the weekend!',
      },
    });

    console.log('Murmurs created!');

    // Create likes
    console.log('Creating likes...');
    await prisma.murmurLike.createMany({
      data: [
        { userId: bob.id, murmurId: murmur1.id },
        { userId: charlie.id, murmurId: murmur1.id },
        { userId: alice.id, murmurId: murmur2.id },
        { userId: charlie.id, murmurId: murmur2.id },
        { userId: alice.id, murmurId: murmur3.id },
        { userId: bob.id, murmurId: murmur4.id },
        { userId: diana.id, murmurId: murmur4.id },
        { userId: alice.id, murmurId: murmur6.id },
      ],
    });

    console.log('Likes created!');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest users created:');
    console.log(`- Alice (ID: ${alice.id})`);
    console.log(`- Bob (ID: ${bob.id})`);
    console.log(`- Charlie (ID: ${charlie.id})`);
    console.log(`- Diana (ID: ${diana.id})`);
    console.log(
      '\nYou can use these IDs in the x-user-id header for API requests.',
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void seed();
