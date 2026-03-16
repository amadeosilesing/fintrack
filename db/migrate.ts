import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations complete!");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});