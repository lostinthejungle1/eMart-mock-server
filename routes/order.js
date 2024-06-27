const verifyToken = require('../middleware/auth');

module.exports = (server, db) => {
    //order status could be: pending_payment, pending_delivery, pending_acceptance, completed, cancelled

    //get all orders
    server.get('/orders', verifyToken, async (req, res) => {
        try {
            const orders = db.get('orders').value();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    //get orders with details of products
    //the response structure should be like this
    // {
    //     order_id: 1,
    //     order_status: 'pending_payment',
    //     products: [
    //         {
    //             id: 1,
    //             thumbnail_url: 'https://example.com/image.jpg',
    //             specifications: 'This is a product',
    //             price: 100,
    //             title: 'Product 1',
    //             count: 2
    //         },
    //         {
    //             id: 2,
    //             thumbnail_url: 'https://example.com/image.jpg',
    //             specifications: 'This is a product',
    //             price: 200,
    //             title: 'Product 2',
    //             count: 1
    //         }
    //     ],
    //     order_datetime: '2021-01-01 12:00:00',
    //     order_total: 400,
    // }
    server.get('/order/details', verifyToken, async (req, res) => {
        try {
            const orders = db.get('orders').value();
            const detailedOrders = await Promise.all(orders.map(async order => {
                const detailedProducts = await Promise.all(order.products.map(async cartProduct => {
                    const product = await db.get('products').find({ id: cartProduct.product_id }).value();
                    return {
                        id: product.id,
                        thumbnail_url: product.thumbnail_url,
                        specifications: product.specifications,
                        price: product.price,
                        title: product.title,
                        count: cartProduct.count,
                        spec:product.specifications
                    };
                }));
                return {
                    order_id: order.order_id,
                    order_status: order.status,
                    products: detailedProducts,
                    order_datetime: order.order_create_time,
                    order_total: order.total_price
                };
            }));
            res.status(200).json(detailedOrders);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    //get order details with paras status
    server.get('/order/details/:status', verifyToken, async (req, res) => {
        try {
            const orders = db.get('orders').filter({ status: req.params.status }).value();
            console.log('filtered orders',orders)
            const detailedOrders = await Promise.all(orders.map(async order => {
                const detailedProducts = await Promise.all(order.products.map(async cartProduct => {
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
                return {
                    order_id: order.order_id,
                    order_status: order.status,
                    products: detailedProducts,
                    order_datetime: order.order_create_time,
                    order_total: order.total_price
                };
            }));
            res.status(200).json(detailedOrders);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}