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
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://bin-wise-ntqx2dkq4-nourseens-projects.vercel.app",
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

// Routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/pickups", pickupRoutes);
app.use("/api/delivery-agents", deliveryAgentRoutes);
app.use("/api/centers", centersRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export default app;