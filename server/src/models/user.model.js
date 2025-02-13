import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define schema
const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true, // Create createdAt and updatedAt fields automatically
	}
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
	const user = this;

	if (!user.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
});

// Create User model
const User = mongoose.model("User", userSchema);

export default User;
