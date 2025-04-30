/* Copyright (c) 2025 Brandon C Bailey
 * Program to pull from the notion workspace, process the data, and push to
 * the database provided. requires bundling with the api password.
*/
const { config } = require("dotenv");
const { NotionHelper } = require("./NotionHelper");
const postgres = require("postgres");
const { generateNameMap, generateWordMap, generateInvertedIndex } = require("./SearchStructures");

config();
const database_key = process.env.VERCEL_POSTGRES_DB_URL;
const notion_key = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;
const notion_page = process.env.NOTION_PAGE_ID_SCOUNTING;

const program = async () => {
    console.log("NSF-NATELELAND.com data retreival. Copyright (c) Brandon C Bailey.");
    console.log("Retreiving notion pages...");
    nh = new NotionHelper(notion_key);
    await nh.getData(notion_page);
    console.log("Finished retreiving pages, processing data");
    data = await nh.processDataToHTML();
    console.log("Processing complete. sending to database");

    sql = postgres(database_key);
    if (false){

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
    if (!(Array.isArray(data))) {
        console.error("type error, data from notion not correct format.");
        return;
    }
    // remove the playerpage_text field from data since the database does not store it
    data.foreach(player => {delete player.playerpage_text});

    await sql`INSERT INTO players ${sql(data)}`;

    console.log("Data sent.");
}

    // next we generate the trie and inverted index over all documents
    console.log("Generating trie and inverted index...");
    const wordIndex = generateWordIndex(data);
    const nameIndex = generateNameIndex(data);
    const invertedIndex = generateInvertedIndex(data, wordIndex, nameIndex);;

    console.log("Trie and inverted index generated. sending to database...");
    await sql`DROP TABLE IF EXISTS playerpage_inverted_index`;
    await sql`CREATE TABLE playerpage_inverted_index (
        word_index SMALLINT,
        player_name_index SMALLINT
    )`;
    await sql`INSERT INTO playerpage_inverted_index ${sql(invertedIndex)}`;

    console.log("Inverted index sent to database. sending word index...");
    await sql`DROP TABLE IF EXISTS playerpage_word_index`;
    await sql`CREATE TABLE playerpage_word_index (
        index Int,
        word Text
    )`;
    await sql`INSERT INTO playerpage_word_index ${sql(wordIndex)}`;

    console.log("Word index sent to database. sending name index...");
    await sql`DROP TABLE IF EXISTS playerpage_name_index`;
    await sql`CREATE TABLE playerpage_name_index (
        index Int,
        name Text
    )`;
    await sql`INSERT INTO playerpage_name_index ${sql(nameIndex)}`;
    console.log("Name index sent to database. all data sent to database.");

    process.exit();
}

program();