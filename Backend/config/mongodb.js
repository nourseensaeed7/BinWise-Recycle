import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // Prevent multiple connections in serverless
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "blogData",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);

    // 👇 Print all collections (only on first connection)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("📂 Collections in blogData:", collections.map(c => c.name));
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit process in serverless - throw error instead
    throw error;
  }
};

export default connectDB;