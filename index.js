const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const authMiddleware = require('./middleware/auth');

const usersRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const addressRoutes = require('./routes/address');

server.use(middlewares);
// server.use('/api', authMiddleware, router);  // Apply auth middleware to all routes under /api
server.use(jsonServer.bodyParser);

// Initialize routes
usersRoutes(server, router.db);  // For user CRUD operations
authRoutes(server, router.db);   // For authentication
productRoutes(server, router.db);   
categoryRoutes(server, router.db);   
cartRoutes(server, router.db);   
orderRoutes(server, router.db);   
addressRoutes(server, router.db);   

// server.use('/api', router);
server.listen(4000, () => {
    console.log('Server is running');
});
