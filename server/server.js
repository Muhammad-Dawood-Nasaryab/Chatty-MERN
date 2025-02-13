import dotenv from "dotenv";

import app from "./src/app.js";
import connectDB from "./src/lib/db.js";

// Load environment variables from.env file
dotenv.config();
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
	connectDB();
	console.log(`\nServer running at http://localhost:${PORT}`);
});
