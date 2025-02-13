import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import logger from "./middlewares/logger.middleware.js";

const app = express();

// Middlewares
app.use(logger);
app.use(cookieParser());
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export default app;
