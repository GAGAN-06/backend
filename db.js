const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    user: 'tranlsations_user', // replace with your PostgreSQL username
    host: 'dpg-csf575ggph6c73evvsn0-a',
    database: 'tranlsations', // replace with your database name
    password: "4tppv6m9mjsJNlkyTuV6bkUEyPPE90rg", // replace with your PostgreSQL password
    port: 5432,
});
module.exports = pool;