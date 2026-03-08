import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "real_estate_db";

async function initDb() {
  // Connect without database first to create it
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  console.log("Connected to MySQL server.");

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  console.log(`Database "${DB_NAME}" ensured.`);

  await conn.query(`USE \`${DB_NAME}\``);

  // Create properties table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      price BIGINT NOT NULL DEFAULT 0,
      location VARCHAR(500) NOT NULL,
      type VARCHAR(100) NOT NULL,
      status VARCHAR(100) NOT NULL,
      beds INT NOT NULL DEFAULT 0,
      baths INT NOT NULL DEFAULT 0,
      area INT NOT NULL DEFAULT 0,
      image TEXT,
      description TEXT,
      tags JSON,
      contactName VARCHAR(255),
      contactPhone VARCHAR(50),
      postedAt VARCHAR(255),
      ownerEmail VARCHAR(255),
      ownerName VARCHAR(255),
      visibility ENUM('approved', 'hidden', 'pending') DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('Table "properties" ensured.');

  // Create users table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255),
      phone VARCHAR(50),
      role ENUM('user', 'admin') DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  console.log('Table "users" ensured.');

  // Seed data from db.json
  const dbJsonPath = path.join(__dirname, "db.json");
  try {
    const raw = await fs.readFile(dbJsonPath, "utf8");
    const data = JSON.parse(raw);

    // Seed properties
    if (Array.isArray(data.properties) && data.properties.length > 0) {
      const [existing] = await conn.query(
        "SELECT COUNT(*) as count FROM properties",
      );
      if (existing[0].count === 0) {
        for (const p of data.properties) {
          await conn.query(
            `INSERT INTO properties (title, price, location, type, status, beds, baths, area, image, description, tags, contactName, contactPhone, postedAt, ownerEmail, ownerName, visibility)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.title,
              p.price,
              p.location,
              p.type,
              p.status,
              p.beds || 0,
              p.baths || 0,
              p.area || 0,
              p.image || null,
              p.description || null,
              JSON.stringify(p.tags || []),
              p.contactName || null,
              p.contactPhone || null,
              p.postedAt || null,
              p.ownerEmail || null,
              p.ownerName || null,
              p.visibility || "approved",
            ],
          );
        }
        console.log(`Seeded ${data.properties.length} properties.`);
      } else {
        console.log("Properties table already has data, skipping seed.");
      }
    }

    // Seed users
    if (Array.isArray(data.users) && data.users.length > 0) {
      const [existing] = await conn.query(
        "SELECT COUNT(*) as count FROM users",
      );
      if (existing[0].count === 0) {
        for (const u of data.users) {
          await conn.query(
            `INSERT INTO users (fullName, email, password, phone, role, createdAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              u.fullName,
              u.email,
              u.password || null,
              u.phone || null,
              u.role || "user",
              u.createdAt ? new Date(u.createdAt) : new Date(),
            ],
          );
        }
        console.log(`Seeded ${data.users.length} users.`);
      } else {
        console.log("Users table already has data, skipping seed.");
      }
    }
  } catch (err) {
    console.log(
      "No db.json found or error reading it, skipping seed:",
      err.message,
    );
  }

  await conn.end();
  console.log("Database initialization complete!");
}

initDb().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
