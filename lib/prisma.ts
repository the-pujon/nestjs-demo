import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

if (
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_PASSWORD ||
  !process.env.DATABASE_NAME
) {
  throw new Error(
    'Missing required database environment variables. Please check your .env file.',
  );
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER || 'docker',
  password: process.env.DATABASE_PASSWORD || 'docker',
  database: process.env.DATABASE_NAME || 'test',
  connectionLimit: 5,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
