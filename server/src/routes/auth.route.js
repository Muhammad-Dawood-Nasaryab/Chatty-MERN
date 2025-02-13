import express from "express";

import controller from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/auth.middleware.js";

// Router Instance
const router = express.Router();

// Routes
router
	.get("/check", protectedRoute, controller.checkAuth)
	.put("/update-profile", protectedRoute, controller.updateProfile)
	.post("/register", controller.register)
	.post("/login", controller.login)
	.post("/logout", controller.logout);

export default router;
