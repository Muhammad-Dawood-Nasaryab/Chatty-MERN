import express from "express";

import controller from "../controllers/message.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

// Router Instance
const router = express.Router();

// Routes
router
	.get("/users", protectedRoute, controller.getUsersForSidebar)
	.get("/:id", protectedRoute, controller.getMessages)
	.post("/send/:id", protectedRoute, controller.sendMessage);

export default router;
