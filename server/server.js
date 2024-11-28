


const express = require('express');
const path = require('path');

const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 


// URL MongoDB et base de données
const mongoUrl = 'mongodb://localhost:27017'; 
const dbName = 'tp2';

app.use(express.json());


////API

// WWW:
app.use(express.static(path.join(__dirname, 'WWW')));

// Route par défaut pour renvoyer index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'WWW', 'index.html'));
});


// Route pour rechercher un produit par ID
app.get('/product/:productID', async (req, res) => {
    const productID = parseInt(req.params.productID, 10); 
    if (!(productID)) {
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

// Route pour rechercher un supplier par ID
app.get('/supplier/:supplierID', async (req, res) => {
    const SupplierID = parseInt(req.params.supplierID, 10); 
    if (!(SupplierID)) {
        return res.status(400).json({ error: 'Invalid supplierID. Must be an integer.' });
    }

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('suppliers');

        // Recherche dans MongoDB
        const supplier = await collection.findOne({ SupplierID }); 
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
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

// Route pour rechercher un customer par ID
app.get('/customer/:customerID', async (req, res) => {
    const CustomerID = req.params.customerID; 
    if (!(CustomerID)) {
        return res.status(400).json({ error: 'Invalid customerID. Must be a String.' });
    }

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('customers');

        // Recherche dans MongoDB
        const customer = await collection.findOne({ CustomerID }); 
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
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

// Route pour rechercher une order par ID
app.get('/order/:orderID', async (req, res) => {
    const OrderID = parseInt(req.params.orderID, 10); 
    if (!(OrderID)) {
        return res.status(400).json({ error: 'Invalid oderID. Must be an integer.' });
    }

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('orders');

        // Recherche dans MongoDB
        const order = await collection.find({ OrderID }).toArray();
        if (order.length >0) {
            res.json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
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

// Route pour rechercher la liste des commandes d'un customer triée par date
app.get('/customer_order/:customerID', async (req, res) => {
    const customerID = req.params.customerID;

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const orders = await db.collection('orders').aggregate([
            {
                $match: { CustomerID: customerID } 
            },
            {
                $sort: { OrderDate: 1 } 
            }
        ]).toArray();
       
        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ error: 'No orders found for this customer' });
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

// Route pour rechercher la liste des produits d'un supplier triée par nom
app.get('/supplier_product/:supplierID', async (req, res) => {
    const supplierID = parseInt(req.params.supplierID, 10);

    if (isNaN(supplierID)) {
        return res.status(400).json({ error: 'Invalid supplierID. Must be an integer.' });
    }

    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const productsCollection = db.collection('products');
        
        // Recherche des produits pour un fournisseur donné et triée par nom
        const products = await productsCollection.find({ supplierID }).sort({ "productName": 1 }).toArray();

        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'No products found for this supplier' });
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
