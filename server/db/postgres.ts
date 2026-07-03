import pg from "pg";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export const getPool = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.POSTGRES_SSL === "false"
          ? false
          : { rejectUnauthorized: false },
    });
  }

  return pool;
};

