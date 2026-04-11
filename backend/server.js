import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS configuration — only allow local frontend
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Smart Task Management System Backend is running on localhost:4000");
});

// ✅ Register routes after DB connects
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");

    app.use("/api/user", userRouter);
    app.use("/api/tasks", taskRouter);

    // ✅ Global error handler
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    app.listen(port, () => {
      console.log(`🚀 Server running locally at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
