const { runPlayersSync } = require("../../adr/syncPlayers");

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
		const result = await runPlayersSync({
			years: ["2025", "2026"],
			pushToDb: true,
		});

		console.log("[cron] Daily sync completed", result);

		res.status(200).json({
			ok: true,
			message: "Daily sync completed.",
			result,
		});
	} catch (error) {
		console.error("[cron] Daily sync failed", {
			message: error.message,
			code: error.code,
			signal: error.signal,
			killed: error.killed,
			stack: error.stack,
		});

		res.status(500).json({
			ok: false,
			message: "Daily sync failed.",
			error: error.message,
			code: error.code || null,
		});
	}
};

module.exports = {
	runDailySync,
};
