const express = require('express');

const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 

// URL MongoDB et base de données
const mongoUrl = 'mongodb://localhost:27017'; 
const dbName = 'td5';

app.use(express.json());


////API

// Route pour rechercher un produit par ID
app.get('/product/:productID', async (req, res) => {
    const productID = parseInt(req.params.productID, 10); 
    if (isNaN(productID)) {
        return res.status(400).json({ error: 'Invalid productID. Must be an integer.' });
    }

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('products');

        // Recherche dans MongoDB
        const product = await collection.findOne({ productID }); 
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});

