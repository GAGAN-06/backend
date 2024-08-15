const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres', // replace with your PostgreSQL username
    host: 'localhost',
    database: 'translations', // replace with your database name
    password: "Gagan@0601", // replace with your PostgreSQL password
    port: 5432,
});
module.exports = pool;