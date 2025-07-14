import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

// Data base Configuration
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number (process.env.DB_PORT),
});

// Checking the conexion
pool.connect()
.then(() => console.log("Connected to PostgreSQL"))
.catch(error => console.log(`Error on PostgreSQL conexion: `,error));   