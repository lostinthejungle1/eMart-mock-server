const verifyToken = require('../middleware/auth');

module.exports = (server, db) => {
server.get('/cart', verifyToken, async (req, res) => {
    try {
        const userCart = await db.get('cart').find({ user_id: req.user.id }).value();

        if (userCart) {
            // If the user's cart exists, get detailed product data
            const detailedProducts = await Promise.all(userCart.products.map(async cartProduct => {
                const product = await db.get('products').find({ id: cartProduct.product_id }).value();
                return {
                    id: product.id,
                    thumbnail_url: product.thumbnail_url,
                    specifications: product.specifications,
                    price: product.price,
                    title: product.title,
                    count: cartProduct.count
                };
            }));

            res.status(200).json(detailedProducts);
        } else {
            // If the user's cart doesn't exist, send an appropriate message
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//add prudct to cart
server.post('/cart-add', verifyToken, async (req, res) => {
    try {
        const { product_id, count } = req.body;
        const userCart = await db.get('cart').find({ user_id: req.user.id }).value();

        if (userCart) {
            // If the user's cart exists, add the product to it
            const existingProduct = userCart.products.find(product => product.product_id === product_id);

            if (existingProduct) {
                // If the product already exists in the cart, update the count
                existingProduct.count += count;
            } else {
                // If the product doesn't exist in the cart, add it
                userCart.products.push({ product_id, count });
            }

            db.get('cart')
                .find({ user_id: req.user.id })
                .assign({ products: userCart.products })
                .write();
        } else {
            // If the user's cart doesn't exist, create it
            db.get('cart')
                .push({ user_id: req.user.id, products: [{ product_id, count }] })
                .write();
        }

        res.status(200).send('Product added to cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

    //update cart as a whole
    server.put('/cart', verifyToken, (req, res) => {
    try {
        const { products } = req.body;
        const userCart = db.get('cart').find({ user_id: req.user.id }).value();

        if (userCart) {
            // If the user's cart exists, update it
            const updatedProducts = products.map(product => {
                return {
                    product_id: product.id,
                    count: product.count
                };
            });

            db.get('cart')
                .find({ user_id: req.user.id })
                .assign({ products: updatedProducts })
                .write();
        } else {
            // If the user's cart doesn't exist, create it
            const newCartProducts = products.map(product => {
                return {
                    product_id: product.id,
                    count: product.count
                };
            });

            db.get('cart')
                .push({ user_id: req.user.id, products: newCartProducts })
                .write();
        }

        res.status(200).send('Cart updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
};
