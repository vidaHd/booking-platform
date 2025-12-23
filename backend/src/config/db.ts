import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  while (true) {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
      break;
    } catch (err) {
      console.log("Mongo not ready, retrying...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
};
