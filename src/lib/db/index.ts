import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL belum di-set. Cek file .env / .env.local");
}

/**
 * Pool mysql2 di-cache di global agar tidak membuat koneksi baru
 * setiap hot-reload saat development.
 */
const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

const pool = globalForDb.pool ?? mysql.createPool(DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";
