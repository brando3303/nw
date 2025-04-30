const postgres = require("postgres");
require('dotenv').config();

const connectionString = process.env.VERCEL_POSTGRES_DB_URL;

const getPlayerList = async (req, res) => {
    const sql = await getDB();
    const list = await getPlayerListFromDB(sql);
    res.status(200).send(JSON.stringify(list));
    return;
}

const getPlayer = async (req, res) => {
    const sql = await getDB();
    const player = await getPlayerFromDB(sql, req.query.id);
    res.status(200).send(JSON.stringify(player));
    return;
}

const searchPages = async (req, res) => {
    const sql = await getDB();
    const search = req.query.search;
    if (search == null) {
        res.status(400).send("invalid search query");
        return;
    }
    // step 1: get word index
    const results = await sql`SELECT * FROM playerpage_word_index WHERE word LIKE ${search + '%'}`;
    if (results.length == 0) {  // no word like this found in db
        res.status(200).send(JSON.stringify([]));
        return;
    }
    const wordIndex = results[0].index; // get the word index for the first result
    const closestWord = results[0].word; // get the closest word for the first result

    // step 2: get the  player pages indexes that contain this word
    const playerPageIndices = await sql`SELECT * FROM playerpage_inverted_index WHERE word_index = ${wordIndex}`;
    if (playerPageIndices.length == 0) {  // no player pages with this word found in db
        res.status(200).send(JSON.stringify([]));
        return;
    }

    // step 3: get all players with these indices
    const playerIds = playerPageIndices.map(p => p.player_name_index);

    const players = await sql`SELECT * FROM playerpage_name_index WHERE index = ANY(${playerIds})`;
    if (players.length == 0) {  // no players with this word found in db
        res.status(200).send(JSON.stringify([]));
        return;
    }

    const ret = {players: players, closestWord: closestWord};
    res.status(200).send(JSON.stringify(ret));
    return;
}


const getDB = async () => {
    return postgres(connectionString);
}

const getPlayerListFromDB = async (sql) => {
    return await sql`SELECT id, name, position, score, playerpage_prev, player_img, team_img FROM players`;
}

const getPlayerFromDB = async (sql, id) => {
    return await sql`SELECT * FROM players WHERE id = ${id}`;
}

module.exports = {
    getPlayerList,
    getPlayer,
    searchPages,
}