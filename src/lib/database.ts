// src/lib/database.ts

import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().catch(err => console.error('Failed to connect to the database:', err));
export default client;

export async function getServerTime(): Promise<string> {
  const res = await client.query('SELECT NOW()');
  return res.rows[0].now;
}