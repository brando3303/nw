import { config } from "dotenv"
//import { sql, createPool } from "@vercel/postgres"
import postgres from "postgres"

export class DataBaseHelper {
    constructor(connectionString) {
        this.sql = postgres(connectionString);
    }

    init = async () => {
        await this.sql`CREATE TABLE IF NOT EXISTS players (
            name Text UNIQUE PRIMARY KEY, 
            position Text,
            playerpage Text
        )`;
    }

    insert = async (player) => {
        await this.sql`INSERT INTO players VALUES (${player.name} , ${player.position} , ${player.playerpage})`;
    }

    // players should be an array of {name, position, playerpage}
    insertMany = async (players) => {
        const sql = this.sql
        await sql`INSERT INTO players ${sql(players)}`;
    }


}

