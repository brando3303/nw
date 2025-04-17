const express = require("express");
const postgres = require("postgres");
const { NotionHelper } = require("./NotionHelper");
require('dotenv').config();

const connectionString = process.env.VERCEL_POSTGRES_DB_URL;
const apiKey = process.env.NOTION_API_KEY_NATE_LELAND_SCOUTING;


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

const getDB = async () => {
    return await postgres(connectionString);
}

const getPlayerListFromDB = async (sql) => {
    return await sql`SELECT id, name, position, score, playerpage_prev, player_img, team_img FROM players`;
}

const getPlayerFromDB = async (sql, id) => {
    return await sql`SELECT * FROM players WHERE id = ${id}`;
}

// route that pulls everything from notion.
const updateAll = async (req, res) => {
    const nh = new NotionHelper();
    await nh.init();
    await nh.updateNotion(20);
}

module.exports = {
    getPlayerList,
    getPlayer,
    updateAll
}