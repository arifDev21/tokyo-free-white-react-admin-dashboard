#!/usr/bin/env ts-node

import { SeederRunner } from "../seeders";
import { seedUsers } from "../seeders/001-seed-users";
import { seedInvoices } from "../seeders/002-seed-invoices";

async function runSeeders() {
  const runner = new SeederRunner();

  try {
    await runner.connect();

    // Add seeders
    runner.addSeeder(seedUsers);
    runner.addSeeder(seedInvoices);

    // Run seeders
    await runner.runSeeders();

    console.log("✅ All seeders completed successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await runner.disconnect();
  }
}

async function clearSeeders() {
  const runner = new SeederRunner();

  try {
    await runner.connect();

    // Add seeders
    runner.addSeeder(seedUsers);
    runner.addSeeder(seedInvoices);

    // Clear seeders
    await runner.clearSeeders();

    console.log("✅ All seeders cleared successfully");
  } catch (error) {
    console.error("❌ Clear failed:", error);
    process.exit(1);
  } finally {
    await runner.disconnect();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === "clear") {
  clearSeeders();
} else {
  runSeeders();
}
