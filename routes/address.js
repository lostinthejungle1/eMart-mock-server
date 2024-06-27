
const verifyToken = require('../middleware/auth');
const uuid = require('uuid');

module.exports = (server, db) => {
    //get address list by user id, id is stored in user token
    //get shipping address list of a user using user id
    // "shipping_address": {
    //     "address_id": 1,
    //     "name": "阿黑酱",
    //     "phone": "123456789",
    //     "address": "北京市海淀区西三环北路甲44号院",
    //     "default":true
    //   }
    //id is stored in the token
    //const user = await db.get('user').find({ user_id: req.user.id }).value();

    //get address lits from a single user
    server.get('/address', verifyToken, (req, res) => {
        const user = db.get('users').find({ id: req.user.id }).value();
        if (user) {
            res.status(200).json(user.address);
        } else {
            res.status(404).send('User not found');
        }
    });

    //get address by address id from a list
    server.get('/address/:id', verifyToken, (req, res) => {
        const user = db.get('users').find({ id: req.user.id }).value();
        if (user) {
            const address = user.address.find(a => a.address_id == req.params.id);
            if (address) {
                res.status(200).json(address);
            } else {
                res.status(404).send('Address not found');
            }
        } else {
            res.status(404).send('User not found');
        }
    });

    //add address to a user
    server.post('/address', verifyToken, (req, res) => {
        const user = db.get('users').find({ id: req.user.id }).value();
        if (user) {
            const address = req.body;
            address.address_id = uuid.v4();
            //if set as default, update all other address to false
            if (address.default) {
                user.address.forEach(a => {
                    a.default = false;
                });
            }
            user.address.push(address);
            db.get('users').find({ id: req.user.id }).assign(user).write();
            res.status(200).json({success:true,address});
        } else {
            res.status(404).send({success:false,message:'User not found'});
        }
    });

    //update address by address id
    server.put('/address/:id', verifyToken, (req, res) => {
        const user = db.get('users').find({ id: req.user.id }).value();
        if (user) {
            const address = user.address.find(a => a.address_id == req.params.id);
            if (address) {
                const newAddress = req.body;
                newAddress.address_id = address.address_id;
                const index = user.address.indexOf(address);
                user.address[index] = newAddress;
                //if set as default, update all other address to false
                if (newAddress.default) {
                    console.log('changing default address')
                    user.address.forEach(a => {
                        if(a.address_id !== newAddress.address_id){
                            a.default = false;
                        }
                    });
                }
                db.get('users').find({ id: req.user.id }).assign(user).write();
                res.status(200).json({success:true,newAddress});
            } else {
                res.status(404).send('Address not found');
            }
        } else {
            res.status(404).send('User not found');
        }
    });

    
}
