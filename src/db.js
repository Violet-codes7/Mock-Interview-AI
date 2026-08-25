import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn("No MONGODB_URI set — running in memory-only mode.");
    return false;
  }

  mongoose.connection.on("connected", () => console.log("Mongoose event: connected"));
  mongoose.connection.on("error", (err) => console.error("Mongoose event: error", err.message));
  mongoose.connection.on("disconnected", () => console.warn("Mongoose event: disconnected"));

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log("MongoDB connected");
    return true;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    return false;
  }
}