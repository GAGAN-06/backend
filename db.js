const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    user: 'nextjs_214b_user', // replace with your PostgreSQL username
    host: 'dpg-csur0252ng1s73dop2v0-a',
    database: 'nextjs_214b', // replace with your database name
    password: "lcZHTg0JR557CVJAuYvncPSGQYlfZw2v", // replace with your PostgreSQL password
    port: 5432,
});
module.exports = pool;