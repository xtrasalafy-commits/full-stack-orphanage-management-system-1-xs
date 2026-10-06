import "dotenv/config";
import { ensureSeed } from "../src/db/seed";

ensureSeed()
  .then(() => {
    console.log("✓ Database seeded (demo users, children, needs, cases, health records)");
    process.exit(0);
  })
  .catch((err) => {
    console.error("✗ Seeding failed:", err);
    process.exit(1);
  });
