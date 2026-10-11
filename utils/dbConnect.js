import mongoose from "mongoose";

// reuse one connection across hot reloads and serverless calls
let cached = globalThis.mongoose;
if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
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

export default dbConnect;
