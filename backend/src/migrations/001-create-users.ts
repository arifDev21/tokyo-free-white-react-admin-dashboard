import { Migration } from "./index";
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
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

// Create indexes
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });

export const createUsersMigration: Migration = {
  name: "001-create-users",

  async up(): Promise<void> {
    // Check if model already exists
    if (mongoose.models.User) {
      console.log("User model already exists, skipping");
      return;
    }

    // Create users collection with schema
    const User = mongoose.model("User", UserSchema);

    // Create indexes
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ createdAt: -1 });

    console.log("Users collection created with indexes");
  },

  async down(): Promise<void> {
    // Drop users collection
    await mongoose.connection.db?.collection("users").drop();
    console.log("Users collection dropped");
  },
};
