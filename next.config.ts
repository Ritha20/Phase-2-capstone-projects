import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Load .env.production if in production mode
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? path.resolve(process.cwd(), ".env.production")
      : path.resolve(process.cwd(), ".env"),
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // make JWT_SECRET accessible in the server runtime
  },
};

export default nextConfig;
