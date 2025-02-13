import chalk from "chalk";

import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";

export default {
	/// @desc         - Get all users for the sidebar
	/// @route        - GET /api/messages/users
	/// @access       - Private
	getUsersForSidebar: async (req, res) => {
		try {
			const loggedInUserId = req.user._id;
			const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
				"-password"
			);

			res.status(200).json(users);
		} catch (error) {
			console.log(
				"Error in getUsersForSidebar controller: ",
				chalk.red(error)
			);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	/// @desc         - Get all messages for a user
	/// @route        - GET /api/messages/:id
	/// @access       - Private
	getMessages: async (req, res) => {
		try {
			const { id: userToChatId } = req.params;
			const loggedInUserId = req.user._id;

			// Getting all the messages
			const messages = await Message.find({
				$or: [
					{ senderId: userToChatId, receiverId: loggedInUserId },
					{ senderId: loggedInUserId, receiverId: userToChatId },
				],
			});

			res.status(200).json(messages);
		} catch (error) {
			console.log("Error in getMessages controller: ", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	/// @desc         - Send a new message
	/// @route        - POST /api/messages/send/:id
	/// @access       - Private
	sendMessage: async (req, res) => {
		try {
			const { text, image } = req.body;
			const { id: receiverId } = req.params;
			const senderId = req.user._id;

			// Upload image to cloudinary
			let imageUrl;
			if (image) {
				const UploadRes = cloudinary.uploader.upload(image);
				imageUrl = UploadRes.secure_url;
			}

			// Create a new message in the database
			const newMessage = new Message({
				senderId,
				receiverId,
				text,
				image: imageUrl,
			});
			await newMessage.save();

			// ...Socket.io code

			res.status(201).json(newMessage);
		} catch (error) {
			console.log("Error in sendMessage controller: ", chalk.red(error));
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
};
