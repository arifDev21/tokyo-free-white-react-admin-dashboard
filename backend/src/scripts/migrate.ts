#!/usr/bin/env ts-node

import { MigrationRunner } from "../migrations";
import { createUsersMigration } from "../migrations/001-create-users";
import { createInvoicesMigration } from "../migrations/002-create-invoices";

async function runMigrations() {
  const runner = new MigrationRunner();

  try {
    await runner.connect();

    // Add migrations
    runner.addMigration(createUsersMigration);
    runner.addMigration(createInvoicesMigration);

    // Run migrations
    await runner.runMigrations();

    console.log("✅ All migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await runner.disconnect();
  }
}

async function rollbackMigrations() {
  const runner = new MigrationRunner();

  try {
    await runner.connect();

    // Add migrations
    runner.addMigration(createUsersMigration);
    runner.addMigration(createInvoicesMigration);

    // Rollback migrations
    await runner.rollbackMigrations();

    console.log("✅ All rollbacks completed successfully");
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    process.exit(1);
  } finally {
    await runner.disconnect();
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === "rollback") {
  rollbackMigrations();
} else {
  runMigrations();
}
