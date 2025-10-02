import mongoose from "mongoose";
import { config } from "../config/environment";

export interface Migration {
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class MigrationRunner {
  private migrations: Migration[] = [];

  constructor() {
    this.migrations = [];
  }

  addMigration(migration: Migration): void {
    this.migrations.push(migration);
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log("MongoDB connected for migrations");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  async runMigrations(): Promise<void> {
    console.log("Running migrations...");

    for (const migration of this.migrations) {
      try {
        console.log(`Running migration: ${migration.name}`);
        await migration.up();
        console.log(`✅ Migration ${migration.name} completed`);
      } catch (error) {
        console.error(`❌ Migration ${migration.name} failed:`, error);
        throw error;
      }
    }

    console.log("All migrations completed successfully");
  }

  async rollbackMigrations(): Promise<void> {
    console.log("Rolling back migrations...");

    for (let i = this.migrations.length - 1; i >= 0; i--) {
      const migration = this.migrations[i];
      try {
        console.log(`Rolling back migration: ${migration.name}`);
        await migration.down();
        console.log(`✅ Rollback ${migration.name} completed`);
      } catch (error) {
        console.error(`❌ Rollback ${migration.name} failed:`, error);
        throw error;
      }
    }

    console.log("All rollbacks completed successfully");
  }
}
