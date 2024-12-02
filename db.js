const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'nextjs_214b_user', // replace with your PostgreSQL username
    host:'dpg-csur0252ng1s73dop2v0-a.virginia-postgres.render.com',
    database: 'nextjs_214b', // replace with your database name
    password: 'lcZHTg0JR557CVJAuYvncPSGQYlfZw2v', // replace with your PostgreSQL password
    port: 5432,
    ssl: {
        rejectUnauthorized: false // Only if needed for your hosting environment
    }
});

// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test the connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to database');
        client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

testConnection();

module.exports = pool;