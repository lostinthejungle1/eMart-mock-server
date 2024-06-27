const verifyToken = require('../middleware/auth');

module.exports = (server, db) => {
    // Get new products
    server.get('/products/new-products', verifyToken, (req, res) => {
        try {
            console.log('get new products');
            const products = db.get('new_products').value();
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Get all products
    server.get('/products', verifyToken, (req, res) => {
        console.log('get all products')
        try {
            const products = db.get('products').value();
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Get products by category
    server.get('/products/category/:category', verifyToken, (req, res) => {
        try {
            if(req.params.category === 'all') {
                const products = db.get('products').value();
                res.status(200).json(products);
                return;
            }
            const products = db.get('products').filter({ category: req.params.category }).value();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Get a single product by id
    server.get('/products/:id', verifyToken, (req, res) => {
        console.log('get product by id',req);
        try {
            const product = db.get('products').find({ id: parseInt(req.params.id) }).value();
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Create a new product
    server.post('/products', verifyToken, (req, res) => {
        try {
            const { name, price } = req.body;
            const newProduct = db.get('products').insert({
                name,
                price
            }).write();
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Update an existing product
    server.put('/products/:id', verifyToken, (req, res) => {
        try {
            const { name, price } = req.body;
            const updatedProduct = db.get('products')
                .find({ id: parseInt(req.params.id) })
                .assign({ name, price })
                .write();
            if (updatedProduct) {
                res.json(updatedProduct);
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Delete a product
    server.delete('/products/:id', verifyToken, (req, res) => {
        try {
            db.get('products').remove({ id: parseInt(req.params.id) }).write();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
};