const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const runDailySync = async (req, res) => {
	console.log("[cron] /cron/endpoints invoked", {
		method: req.method,
		hasAuthHeader: Boolean(req.headers.authorization),
		timestamp: new Date().toISOString(),
	});

	if (process.env.CRON_SECRET) {
		const authHeader = req.headers.authorization || "";
		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			console.warn("[cron] Unauthorized cron request");
			res.status(401).send("Unauthorized");
			return;
		}
	}

	try {
		const adrDirectory = path.resolve(__dirname, "../../../ADR");
		const adrExists = fs.existsSync(adrDirectory);
		console.log("[cron] Resolved ADR directory", {
			adrDirectory,
			exists: adrExists,
			runtime: process.execPath,
			cwd: process.cwd(),
		});

		if (!adrExists) {
			throw new Error(`ADR directory not found at: ${adrDirectory}`);
		}

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

		console.log("[cron] Daily sync command finished", {
			stdoutLength: stdout ? stdout.length : 0,
			stderrLength: stderr ? stderr.length : 0,
		});

		res.status(200).json({
			ok: true,
			message: "Daily sync completed.",
			stdout,
			stderr,
		});
	} catch (error) {
		console.error("[cron] Daily sync failed", {
			message: error.message,
			code: error.code,
			signal: error.signal,
			killed: error.killed,
			stdout: error.stdout || "",
			stderr: error.stderr || "",
			stack: error.stack,
		});

		res.status(500).json({
			ok: false,
			message: "Daily sync failed.",
			error: error.message,
			code: error.code || null,
			stdout: error.stdout || "",
			stderr: error.stderr || "",
		});
	}
};

module.exports = {
	runDailySync,
};
