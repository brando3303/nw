/* Copyright (c) 2025 Brandon C Bailey
 * Program to pull from the notion workspace, process the data, and push to
 * the database provided. requires bundling with the api password.
*/
const { config } = require("dotenv");
const { NotionHelper } = require("./NotionHelper");
const postgres = require("postgres");

config();
const database_key = process.env.VERCEL_POSTGRES_DB_URL;
const notion_key = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;
const notion_page = process.env.NOTION_PAGE_ID_SCOUNTING;

const program = async () => {
    console.log("NSF-NATELELAND.com data retreival. Copyright (c) Brandon C Bailey.")
    console.log("Retreiving notion pages...")
    nh = new NotionHelper(notion_key);
    await nh.getData(notion_page);
    console.log("Finished retreiving pages, processing data");
    data = await nh.processData();
    console.log("Processing complete. sending to database");

    sql = postgres(database_key);
    await sql`DROP TABLE IF EXISTS players`

    await sql`CREATE TABLE players (
        id SERIAL PRIMARY KEY,
        name Text,  
        position Text,
        score Int,
        playerpage Text,
        playerpage_prev Text,
        date_edited Date,
        player_img Text,
        team_img Text
    )`;
    console.log("Created table. sending data");

    await sql`INSERT INTO players ${sql(data)}`;

    console.log("Data sent.");
    process.exit();
}

program();