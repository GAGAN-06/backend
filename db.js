const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    user: 'translations_k6sd_user', // replace with your PostgreSQL username
    host: 'dpg-crpfjq68ii6s73ch7ph0-a',
    database: 'translations_k6sd', // replace with your database name
    password: "kivIR4XmdCuYEdlqHnyMbzhtQ3aOhcum", // replace with your PostgreSQL password
    port: 5432,
});
module.exports = pool;