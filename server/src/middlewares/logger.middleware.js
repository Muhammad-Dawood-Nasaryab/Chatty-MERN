import chalk from "chalk";

const logger = (req, res, next) => {
	const methodColors = {
		GET: chalk.green,
		POST: chalk.yellow,
		PUT: chalk.blue,
		PATCH: chalk.cyan,
		DELETE: chalk.red,
	};

	const color = methodColors[req.method] || chalk.rgb(255, 20, 147);

	res.on("finish", () => {
		const statusColor = res.statusCode >= 400 ? chalk.red : chalk.green;
		console.log(
			`      ${color(req.method)}   ${chalk.gray(`${req.protocol}://${req.get("host")}${req.originalUrl}`)}   ${statusColor(res.statusCode)}`
		);
	});

	next();
};

export default logger;
