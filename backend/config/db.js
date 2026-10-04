import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        console.log("DB CONNECTED 🤗");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow retry on next request
        console.error("DB Connection Failed:", err.message);
        throw err; // let callers know it failed
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
