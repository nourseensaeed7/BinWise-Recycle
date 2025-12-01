import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "../config/mongodb.js";

// Routes
import authRouter from "../routes/authRoutes.js";
import postsRouter from "../routes/postsRoutes.js";
import usersRouter from "../routes/userRoutes.js";
import pickupRoutes from "../routes/pickupRoutes.js";
import deliveryAgentRoutes from "../routes/deliveryAgentRoutes.js";
import centersRoutes from "../routes/centersRoutes.js";
import progressRoutes from "../routes/progressRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://bin-wise-recycle.vercel.app", // ✅ Your PRODUCTION URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// API routes - remove /api prefix since Vercel already routes to /api
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/pickups", pickupRoutes);
app.use("/delivery-agents", deliveryAgentRoutes);
app.use("/centers", centersRoutes);
app.use("/progress", progressRoutes);

// Root route - place AFTER other routes
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running ✅" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;