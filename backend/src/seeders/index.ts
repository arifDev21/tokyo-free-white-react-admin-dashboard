import mongoose from "mongoose";
import { config } from "../config/environment";

export interface Seeder {
  name: string;
  run: () => Promise<void>;
  clear: () => Promise<void>;
}

export class SeederRunner {
  private seeders: Seeder[] = [];

  constructor() {
    this.seeders = [];
  }

  addSeeder(seeder: Seeder): void {
    this.seeders.push(seeder);
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log("MongoDB connected for seeders");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  async runSeeders(): Promise<void> {
    console.log("Running seeders...");

    for (const seeder of this.seeders) {
      try {
        console.log(`Running seeder: ${seeder.name}`);
        await seeder.run();
        console.log(`✅ Seeder ${seeder.name} completed`);
      } catch (error) {
        console.error(`❌ Seeder ${seeder.name} failed:`, error);
        throw error;
      }
    }

    console.log("All seeders completed successfully");
  }

  async clearSeeders(): Promise<void> {
    console.log("Clearing seeders...");

    for (const seeder of this.seeders) {
      try {
        console.log(`Clearing seeder: ${seeder.name}`);
        await seeder.clear();
        console.log(`✅ Clear ${seeder.name} completed`);
      } catch (error) {
        console.error(`❌ Clear ${seeder.name} failed:`, error);
        throw error;
      }
    }

    console.log("All seeders cleared successfully");
  }
}
