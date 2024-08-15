const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    user: 'translations_cohy_user', // replace with your PostgreSQL username
    host: 'dpg-cqv33co8fa8c73feki50-a',
    database: 'translations_cohy', // replace with your database name
    password: "cChOjMdHyI6obQxfmzLgXNF3cxdUdOg3", // replace with your PostgreSQL password
    port: 5432,
});
module.exports = pool;