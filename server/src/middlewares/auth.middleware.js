import chalk from "chalk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

// Load environment variables from.env file
dotenv.config();

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		// Checking if token exists
		if (!token) {
			return res
				.status(401)
				.json({ error: "Unauthorized - not token provided" });
		}

		// Verifying token signature and decoding it
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - invalid token" });
		}

		// Finding user by their ID and selecting only necessary fields (excluding password)
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res
				.status(401)
				.json({ error: "Unauthorized - user not found" });
		}

		// Attaching user to request object for further use in routes and controllers
		req.user = user;
		next();
	} catch (error) {
		console.log(chalk.gray("Error in auth middleware: ", error));
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default authMiddleware;
