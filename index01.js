console.log('Test');

const express = require('express');
const app = express();
const PORT = 3000;


//prisijungiam prie duombazes
app.use(express.json());

//apsirasyti routes
// GET /products pvz - route
// GET /products:id - route mes 1 produkta
// CREATE /products/create
// UPDATE /products/update/:id - route
// DELETE /products/delete/:id


app.get('/products', async (req, res) => {

    try {
        res.status(200).json({ message: 'sekmingai pasiekiamas /produktu puslapis' })
    }
    catch (err) {
        res.status(400).json({ error: 'error' })
    }
});


app.listen(PORT, () => {
    console.log(`serveris paleistas ant: ${PORT}`)
})
