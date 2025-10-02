#!/usr/bin/env ts-node

import { MigrationRunner } from "../migrations";
import { SeederRunner } from "../seeders";
import { createUsersMigration } from "../migrations/001-create-users";
import { createInvoicesMigration } from "../migrations/002-create-invoices";
import { seedUsers } from "../seeders/001-seed-users";
import { seedInvoices } from "../seeders/002-seed-invoices";

async function setupDatabase() {
  console.log("🚀 Setting up database...");

  // Run migrations
  console.log("\n📋 Running migrations...");
  const migrationRunner = new MigrationRunner();

  try {
    await migrationRunner.connect();

    // Add migrations
    migrationRunner.addMigration(createUsersMigration);
    migrationRunner.addMigration(createInvoicesMigration);

    // Run migrations
    await migrationRunner.runMigrations();

    console.log("✅ Migrations completed");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationRunner.disconnect();
  }

  // Run seeders
  console.log("\n🌱 Running seeders...");
  const seederRunner = new SeederRunner();

  try {
    await seederRunner.connect();

    // Add seeders
    seederRunner.addSeeder(seedUsers);
    seederRunner.addSeeder(seedInvoices);

    // Run seeders
    await seederRunner.runSeeders();

    console.log("✅ Seeders completed");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await seederRunner.disconnect();
  }

  console.log("\n🎉 Database setup completed successfully!");
  console.log("\n📊 Sample data created:");
  console.log(
    "   👤 Users: admin, user1, demo (password: admin123, user123, demo123)"
  );
  console.log("   📄 Invoices: 5 sample invoices with different customers");
}

setupDatabase();
