import chalk from "chalk";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import generateToken from "../utils/generate-token.js";

export default {
	/// @desc         - Make a new user in the database
	/// @route        - POST /api/auth/register
	/// @access       - Public
	register: async (req, res) => {
		const { fullName, email, password } = req.body; // Retrieving data from request
		try {
			// Checking if full name and email are provided
			if (!fullName || !email || !password) {
				return res.status(400).json({ error: "Please fill in all fields" });
			}

			// Checking if password has 6 or greater characters
			if (password.length < 6) {
				return res
					.status(400)
					.json({ error: "Password must be at least 6 characters" });
			}

			// Checking if email is already registered
			const user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ error: "Email already exists" });
			}

			// Creating a new user object and saving it to the database
			const newUser = new User({ fullName, email, password });

			// Validating user data before saving
			if (!newUser) {
				return res.status(400).json({ error: "Invalid user data" });
			}

			// Generating and sending JWT token to the client
			generateToken(res, newUser._id);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} catch (error) {
			console.log("Error in register controller:", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	/// @desc         - Authenticate user and generate JWT token
	/// @route        - POST /api/auth/login
	/// @access       - Public
	login: async (req, res) => {
		const { email, password } = req.body; // Retrieving data from request
		try {
			const user = await User.findOne({ email });

			// Checking if user exists
			if (!user) {
				return res.status(401).json({ error: "Invalid credentials" });
			}

			// Checking if password matches
			const isPasswordCorrect = await bcrypt.compare(
				password,
				user.password
			);
			if (!isPasswordCorrect) {
				return res.status(401).json({ error: "Invalid credentials" });
			}

			// Generating and sending JWT token to the client
			generateToken(res, user._id);

			res.status(200).json({
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				profilePic: user.profilePic,
			});
		} catch (error) {
			console.log("Error in login controller: ", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	/// @desc         - Log out user and delete JWT token
	/// @route        - POST /api/auth/logout
	/// @access       - Private
	logout: (req, res) => {
		try {
			res.cookie("jwt", "", { maxAge: 0 });
			res.status(200).json({ message: "Logged out successfully" });
		} catch (error) {
			console.log("Error in logout controller: ", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	/// @desc         - Allow user to update their data
	/// @route        - PUT /api/auth/update-profile
	/// @access       - Private
	updateProfile: async (req, res) => {
		try {
			const { profilePic } = req.body;
			const userId = req.user._id;

			// Checking i profile picture is given
			if (!profilePic) {
				return res
					.status(400)
					.json({ error: "Please provide a profile picture" });
			}

			// Uploading profile picture to Cloudinary
			const uploadRes = await cloudinary.uploader.upload({
				public_id: `${userId}-${Date.now()}`,
				file: profilePic,
			});

			// Updating user's profile picture in the database
			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ profilePic: uploadRes.secure_url },
				{ new: true }
			);

			res.status(200).json({ updatedUser });
		} catch (error) {
			console.log("Error in update profile controller: ", chalk.red(error));
		}
	},

	/// @desc         - Check if user is authenticated
	/// @route        - GET /api/auth/check-auth
	/// @access       - Private
	checkAuth: (req, res) => {
		try {
			const user = req.user;
			if (!user) {
				return res
					.status(401)
					.json({ error: "Unauthorized - user not found" });
			}

			res.status(200).json(user);
		} catch (error) {
			console.log("Error in check auth controller: ", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
};
