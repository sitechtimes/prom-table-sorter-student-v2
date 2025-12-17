import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.DATABASE_URI);
  isConnected = true;
  console.log("MongoDB Connected");
}
