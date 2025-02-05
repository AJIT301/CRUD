require('dotenv').config(); // Load environment variables
const express = require('express'); // Import Express framework
const pool = require('./db'); // Import PostgreSQL connection
// const requestIp = require('request-ip');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Route to get all users
app.use(express.json())
app.get('/users', async (_, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);

    //date logginimas
    const now = new Date();
    //formatavimas
    const formattedDate = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    //displayinam data po kiekvieno requesto is postman cripto minerio.
    console.log("requestas ivykdytas: " + formattedDate);

    // const clientIp = requestIp.getClientIp(req);
    // const logData = `IP: ${clientIp}, Time: ${new Date().toISOString()}\n`;

    // fs.appendFile('access.log', logData, (err) => {
    //     if (err) {
    //         console.error('Failed to log access data:', err);
    //     }
    // });
});

//$1 is a positional parameter placeholder. It is used to safely insert the value of the variable id into the SQL query.
//  This helps prevent SQL injection attacks by ensuring that the value is properly escaped.
// const result = await pool.query(`select * from users where id = ${id}`); <--- nesaugus budas, galimas SQL injection
app.get('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const results = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results.rows);
    } catch (err) {
        console.error(err); // Add this for more detailed error logging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//  POST         /users - route sukurs users
app.post('/users', async (req, res) => {
    try {
        const { id, username, password } = req.body;

        if (!id || !username || !password) {
            return res.status(400).json({ error: 'ID, username, and password are required' });
        }

        // Insert the user using a parameterized query
        const results = await pool.query(
            `INSERT INTO users (id, username, "password") 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [id, username, password]
        );

        res.status(201).json(results.rows[0]);
        console.log("Created new user:", results.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.put('/users:id', async (req, res) => {
//     try {
//         // insert into users (id,username,"password")  values (1000, 'idetasPerInsert','idetasPerInser')
//         const id = req.params.id;
//         const { username, password } = req.body;

//         const results = await pool.query(`update users 
//             set username = '${username}',
//             "password" = '${password}'
//             where id = ${id}
//             returning *`);


//         // const results = await pool.query(`select * from users where id=${id}`);
//         res.status(201).json(results.rows[0]);

//         const checkUser = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
//         if (checkUser.rows.length === 0) {
//             throw new Error('User creation failed');
//         }
//         else {
//             console.log("updated new user")
//             console.log(results.rows[0])
//         }
//         // res.status(200).json({ message: 'Sėkmingai pasiekiamas produktų puslapis'});
//     }
//     catch (err) {
//         res.status(400).json({ error: 'error' });
//     }

// });
//SQL INJECTION. NENAUDOTI.

app.put('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Update the user using parameterized query
        const results = await pool.query(
            `UPDATE users
             SET username = $1,
             "password" = $2
             WHERE id = $3
             RETURNING *`,
            [username, password, id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log("Updated user:", results.rows[0]);
        res.status(200).json(results.rows[0]);

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const results = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [id]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: results.rows[0] });
        console.log(`'User deleted successfully', user: ${req.params.id}`)

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Atsargiai, saugokis kobros.`)
});