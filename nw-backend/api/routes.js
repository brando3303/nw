const express = require("express");
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
    const player = await getPlayerFromDB(sql, req.query.name);
    res.status(200).send(JSON.stringify(player));
    return;
}

const getDB = async () => {
    return await postgres(connectionString);
}

const getPlayerListFromDB = async (sql) => {
    return await sql`SELECT name, position FROM players`;
}

const getPlayerFromDB = async (sql, name) => {
    return await sql`SELECT * FROM players WHERE name = ${name}`;
}

module.exports = {
    getPlayerList,
    getPlayer
}