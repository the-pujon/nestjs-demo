/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Quick DB connection test
import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Host:', process.env.DATABASE_HOST);
  console.log('Port:', process.env.DATABASE_PORT);
  console.log('User:', process.env.DATABASE_USER);
  console.log('Database:', process.env.DATABASE_NAME);
  console.log('Password length:', process.env.DATABASE_PASSWORD?.length || 0);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectTimeout: 10000,
    });

    console.log('✅ Connected successfully!');

    const [rows] = await connection.execute(
      'SELECT DATABASE(), USER(), VERSION()',
    );
    console.log('Database info:', rows[0]);

    await connection.end();
    console.log('✅ Connection test passed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    process.exit(1);
  }
}

testConnection();
