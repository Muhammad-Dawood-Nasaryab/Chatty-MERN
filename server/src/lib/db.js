import chalk from "chalk";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(
			`\n${chalk.bgGreen(" Success ")} Connected to MongoDB: ${conn.connection.host}`
		);
	} catch (error) {
		console.log(
			`\n${chalk.bgRed(" Fail ")} Error connecting to MongoDB:`,
			error
		);
		process.exit(1); // Exit process with failure
	}
};

export default connectDB;
