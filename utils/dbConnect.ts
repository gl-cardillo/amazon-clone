import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// reuse one connection across hot reloads and serverless calls
const cached: MongooseCache = (globalThis.mongooseCache ??= {
  conn: null,
  promise: null,
});

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set");
    // indexes are built by scripts/seed.mts, not on every cold start
    cached.promise = mongoose.connect(uri, { autoIndex: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // allow the next call to retry
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
