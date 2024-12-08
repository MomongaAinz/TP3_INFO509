
const express = require('express');
const path = require('path');

const { MongoClient } = require('mongodb');

const app = express();
const port = 3000; 


// URL MongoDB et base de données
const mongoUrl = 'mongodb://localhost:27017'; 
const dbName = 'td5';

app.use(express.json());


////API

// WWW:
app.use(express.static(path.join(__dirname, '../client')));

// Route par défaut pour renvoyer index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname,'../client', 'dashboard.html'));
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
                $match: { CustomerID: customerID }  // Filtre pour le client
            },
            {
                $group: {  // Regroupe les commandes par OrderID
                    _id: "$OrderID",
                    CustomerID: { $first: "$CustomerID" },
                    EmployeeID: { $first: "$EmployeeID" },
                    OrderDate: { $first: "$OrderDate" },
                    RequiredDate: { $first: "$RequiredDate" },
                    ShippedDate: { $first: "$ShippedDate" },
                    ShipVia: { $first: "$ShipVia" },
                    Freight: { $first: "$Freight" },
                    ShipName: { $first: "$ShipName" },
                    ShipAddress: { $first: "$ShipAddress" },
                    ShipCity: { $first: "$ShipCity" },
                    ShipRegion: { $first: "$ShipRegion" },
                    ShipPostalCode: { $first: "$ShipPostalCode" },
                    ShipCountry: { $first: "$ShipCountry" },
                    Products: {  // Regroupe les produits pour chaque OrderID
                        $push: {
                            ProductID: "$ProductID",
                            UnitPrice: "$UnitPrice",
                            Quantity: "$Quantity",
                            Discount: "$Discount"
                        }
                    }
                }
            },
            {
                $project: {  // Calcule le prix total de la commande (OrderPrice)
                    CustomerID: 1,
                    EmployeeID: 1,
                    OrderDate: 1,
                    RequiredDate: 1,
                    ShippedDate: 1,
                    ShipVia: 1,
                    Freight: 1,
                    ShipName: 1,
                    ShipAddress: 1,
                    ShipCity: 1,
                    ShipRegion: 1,
                    ShipPostalCode: 1,
                    ShipCountry: 1,
                    Products: 1,
                    OrderPrice: {  // Calcule le prix total de la commande
                        $round: [
                            {  // Effectue le calcul du prix
                                $sum: {
                                    $map: {
                                        input: "$Products",
                                        as: "product",
                                        in: {
                                            $multiply: [
                                                { $subtract: [1, "$$product.Discount"] }, // Applique la remise
                                                "$$product.UnitPrice",
                                                "$$product.Quantity"
                                            ]
                                        }
                                    }
                                }
                            },
                            2  // Arrondi à 2 décimales
                        ]
                    }
                }
            },
            {
                $sort: { OrderDate: 1 }  // Trie les commandes par date
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


// Route pour récupérer tous les clients
app.get('/customers', async (req, res) => {
    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const customers = await db.collection('customers').find({}).toArray();

        if (customers.length > 0) {
            res.json(customers);
        } else {
            res.status(404).json({ error: 'No customers found' });
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


// Route pour récupérer tous les produits
app.get('/products', async (req, res) => {
    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const products = await db.collection('products').find({}).toArray();

        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'No products found' });
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



// Route pour récupérer toutes les commandes
app.get('/orders', async (req, res) => {
    let client;
    try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const orders = await db.collection('orders').find({}).toArray();

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ error: 'No orders found' });
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
