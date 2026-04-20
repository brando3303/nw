const { config } = require("dotenv");
const postgres = require("postgres");
const { NotionHelper } = require("./NotionHelper");

config();

const runPlayersSync = async ({ years = ["2025", "2026"], pushToDb = true } = {}) => {
    const database_key = process.env.VERCEL_POSTGRES_DB_URL;
    const notion_key = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;

    if (!database_key) {
        throw new Error("Missing env VERCEL_POSTGRES_DB_URL");
    }
    if (!notion_key) {
        throw new Error("Missing env NOTION_API_KEY_NATE_LELAND_SCOUTING");
    }

    console.log("[sync] Retrieving notion pages...");
    const nh = new NotionHelper(notion_key);
    await nh.getData(years);

    console.log("[sync] Processing notion data...");
    const data = await nh.processDataToHTML();

    if (!Array.isArray(data)) {
        throw new Error("Processed data is not an array");
    }

    if (pushToDb) {
        const sql = postgres(database_key);
        await sql`CREATE TABLE IF NOT EXISTS players (
             id SERIAL PRIMARY KEY,
             name Text,
             position Text,
             score Int,
             playerpage Text,
             playerpage_prev Text,
             date_edited Date,
             player_img Text,
             team_img Text,
             year Text
         )`;

        await sql`TRUNCATE TABLE players RESTART IDENTITY`;
        await sql`INSERT INTO players ${sql(data)}`;

        await sql.end({ timeout: 5 });
    }

    return {
        ok: true,
        count: data.length,
        years,
    };
};

module.exports = {
    runPlayersSync,
};
