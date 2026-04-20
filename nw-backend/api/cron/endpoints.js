const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const runDailySync = async (req, res) => {
	if (process.env.CRON_SECRET) {
		const authHeader = req.headers.authorization || "";
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			res.status(401).send("Unauthorized");
			return;
		}
	}

	try {
		const adrDirectory = path.resolve(__dirname, "../../../ADR");

		const { stdout, stderr } = await execFileAsync(
			process.execPath,
			["index.js", "--push-db"],
			{
				cwd: adrDirectory,
				env: process.env,
				timeout: 1000 * 60 * 14,
				maxBuffer: 1024 * 1024 * 10,
			}
		);

		res.status(200).json({
			ok: true,
			message: "Daily sync completed.",
			stdout,
			stderr,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: "Daily sync failed.",
			error: error.message,
			stdout: error.stdout || "",
			stderr: error.stderr || "",
		});
	}
};

module.exports = {
	runDailySync,
};
