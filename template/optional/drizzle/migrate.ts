import { migrate } from "drizzle-orm/libsql/migrator";

import { db } from "@/db";

async function main() {
  console.log("🚀 Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations completed!");
}

main().catch((e) => {
  console.error("❌ Error during migration:", e);
  process.exit(1);
});
