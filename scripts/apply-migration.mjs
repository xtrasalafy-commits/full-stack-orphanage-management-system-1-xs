import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const file = process.argv[2] ?? path.join(process.cwd(), "drizzle", "0000_init.sql");
const sql = fs.readFileSync(file, "utf8");
const statements = sql
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });

try {
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  const r = await pool.query(
    `select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
  );
  console.log(`Applied ${statements.length} statements. Public tables:`);
  for (const row of r.rows) console.log("  -", row.table_name);
} catch (e) {
  console.error("Migration failed:", e.message);
  process.exitCode = 1;
} finally {
  await pool.end().catch(() => {});
}
