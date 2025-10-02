import { Seeder } from "./index";
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export const seedUsers: Seeder = {
  name: "001-seed-users",

  async run(): Promise<void> {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log("Users already exist, skipping seeder");
      return;
    }

    // Create sample users
    const users = [
      {
        username: "admin",
        passwordHash: await bcrypt.hash("admin123", 10),
      },
      {
        username: "user1",
        passwordHash: await bcrypt.hash("user123", 10),
      },
      {
        username: "demo",
        passwordHash: await bcrypt.hash("demo123", 10),
      },
    ];

    await User.insertMany(users);
    console.log(`Created ${users.length} users`);
  },

  async clear(): Promise<void> {
    await User.deleteMany({});
    console.log("All users cleared");
  },
};
