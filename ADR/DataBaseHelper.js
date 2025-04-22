const dotenv = require('dotenv');
dotenv.config();

// const { sql, createPool } = require('@vercel/postgres');
const postgres = require('postgres');


class DataBaseHelper {
    constructor(connectionString) {
        this.sql = postgres(connectionString);
    }

    init = async () => {// add unique prmiaryto names
        await this.sql`CREATE TABLE IF NOT EXISTS players (
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
    }

    insert = async (player) => {
        await this.sql`INSERT INTO players VALUES 
        (${player.name} , ${player.position} , ${player.playerpage},
        ${player.playerpage_prev}, ${player.date_edited}, ${player.player_img}.
        ${player.team_img})`;
    }

    // players should be an array of {name, position, playerpage}
    insertMany = async (players) => {
        const sql = this.sql
        await sql`INSERT INTO players ${sql(players)}`;
    }


}

module.exports ={
    DataBaseHelper
}
