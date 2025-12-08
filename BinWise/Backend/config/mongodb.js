
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "blogData",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`);

    // 👇 اطبع كل الـcollections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("📂 Collections in blogData:", collections.map(c => c.name));
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
