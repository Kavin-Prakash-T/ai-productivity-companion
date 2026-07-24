import mongoose from "mongoose";
import dns from "dns";

// Bypass restrictive DNS resolvers that block MongoDB Atlas SRV lookup
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.warn("Unable to set public DNS servers:", error);
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env.local");
}

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "productivityDB",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}