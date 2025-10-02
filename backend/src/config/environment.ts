import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  MONGODB_URI: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
}

export const config: Config = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || "5001", 10),
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",

  // Database Configuration
  MONGODB_URI:
    process.env.MONGODB_URI ??
    "mongodb://localhost:27017/tokyo-admin-dashboard",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET ?? "secret-key",

  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:3000",
};
