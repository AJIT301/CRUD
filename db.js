require('dotenv').config(); // Load environment variables

const { Pool } = require('pg'); // Import PostgreSQL client

// Create a connection pool
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
});

// Export the pool so we can use it in other files
module.exports = pool;
