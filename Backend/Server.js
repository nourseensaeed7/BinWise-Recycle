import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDB from "./config/mongodb.js";

// Routes
import authRouter from "./routes/authRoutes.js";
import postsRouter from "./routes/postsRoutes.js";
import usersRouter from "./routes/userRoutes.js";
import pickupRoutes from "./routes/pickupRoutes.js"; // ✅ import normally
import deliveryAgentRoutes from "./routes/deliveryAgentRoutes.js";
import centersRoutes from "./routes/centersRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";



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

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connect to MongoDB
connectDB();

// Create HTTP server & Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Provide io to routes using a function
app.use("/api/pickups", (req, res, next) => {
  req.io = io; // Attach io to request object
  next();
}, pickupRoutes);

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/delivery-agents", deliveryAgentRoutes);
app.use("/api/centers", centersRoutes);
app.use("/api/progress", progressRoutes);
app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import connectDB from "./config/mongodb.js";

// // Routes
// import authRouter from "./routes/authRoutes.js";
// import postsRouter from "./routes/postsRoutes.js";
// import usersRouter from "./routes/userRoutes.js";
// import pickupRoutes from "./routes/pickupRoutes.js";
// import deliveryAgentRoutes from "./routes/deliveryAgentRoutes.js";
// import centersRoutes from "./routes/centersRoutes.js";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://127.0.0.1:5173",
//   "http://127.0.0.1:5174"
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // Serve uploads folder
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/api/auth", authRouter);
// app.use("/api/posts", postsRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/pickups", pickupRoutes);
// app.use("/api/delivery-agents", deliveryAgentRoutes);
// app.use("/api/centers", centersRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("Server is running...");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


