import fs from "node:fs/promises";
import process from "node:process";
import pg from "pg";

const loadDotEnv = async () => {
  try {
    const text = await fs.readFile(".env", "utf8");

    for (const line of text.split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const [, , filePath] = process.argv;

if (!filePath) {
  console.error("Usage: node scripts/run-sql-file.mjs <file.sql|directory>");
  process.exit(1);
}

await loadDotEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.POSTGRES_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

try {
  const stat = await fs.stat(filePath);
  const files = stat.isDirectory()
    ? (await fs.readdir(filePath))
        .filter((name) => name.endsWith(".sql"))
        .sort()
        .map((name) => `${filePath.replace(/\/$/, "")}/${name}`)
    : [filePath];

  await client.connect();

  for (const file of files) {
    const sql = await fs.readFile(file, "utf8");
    await client.query(sql);
    console.log(`Applied ${file}`);
  }
} finally {
  await client.end();
}
