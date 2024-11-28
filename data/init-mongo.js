db = db.getSiblingDB('td5'); // Basculer sur la base de données "td5"

// Insertion initiale pour la collection "products"
db.products.insertMany([
    {
        productID: 1,
        productName: 'Chai',
        supplierID: 1,
        categoryID: 1,
        quantityPerUnit: '10 boxes x 20 bags',
        unitPrice: 18,
        unitsInStock: 39,
        unitsOnOrder: 0,
        reorderLevel: 10,
        discontinued: 0
    },
    {
        productID: 2,
        productName: 'Chang',
        supplierID: 1,
        categoryID: 1,
        quantityPerUnit: '24 - 12 oz bottles',
        unitPrice: 19,
        unitsInStock: 17,
        unitsOnOrder: 40,
        reorderLevel: 25,
        discontinued: 0
    }
]);

// Insertion initiale pour la collection "suppliers"
db.suppliers.insertMany([
    {
        SupplierID: 1,
        CompanyName: 'Exotic Liquids',
        ContactName: 'Charlotte Cooper',
        City: 'London',
        Country: 'UK'
    },
    {
        SupplierID: 2,
        CompanyName: 'New Orleans Cajun Delights',
        ContactName: 'Shelley Burke',
        City: 'New Orleans',
        Country: 'USA'
    }
]);
