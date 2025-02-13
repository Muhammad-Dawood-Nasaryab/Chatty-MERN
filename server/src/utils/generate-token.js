import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Create token
const generateToken = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d", // Token expires in 7 days
	});

	res.cookie("jwt", token, {
		maxAge: 7 * 24 * 60 * 60 * 1000, // miliseconds
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	return token;
};

export default generateToken;
