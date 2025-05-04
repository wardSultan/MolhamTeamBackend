import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../models/url.model";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTableIfNotExists() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
        SELECT * 
        FROM information_schema.tables 
        WHERE table_name = 'urls';
      `);

    if (res.rows.length === 0) {
      console.log("Table 'urls' not found. Creating table...");
      await client.query(`
          CREATE TABLE urls (
            id SERIAL PRIMARY KEY,
            original_url VARCHAR(2048) NOT NULL,
            short_id VARCHAR(10) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT NOW(),
            clicks INTEGER DEFAULT 0
          );
        `);
      console.log("Table 'urls' created successfully.");
    } else {
      console.log("Table 'urls' already exists.");
    }
  } catch (err) {
    console.error("Error checking/creating table:", err);
  } finally {
    client.release();
  }
}

createTableIfNotExists();

export const db = drizzle(pool, {
  schema,
  logger: true,
});

export const drizzleClient = () => db;

async function testConnection() {
  try {
    await pool.connect();
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
}

testConnection();
