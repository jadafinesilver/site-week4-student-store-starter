const prisma = require('../../src/db/db')

// fetch all orderItems 
exports.getAll = async (req, res) => {
    const orderItems = await prisma.orderItem.findMany();
    res.json(orderItems)
};

// create a new orderItem
exports.create = async (req, res) => {
    const order_id = Number(req.params.order_id);
    const { product_id, quantity } = req.body;
    const product = await prisma.product.findUnique( {
        where  : {product_id},
    });
    const newOrderItem = await prisma.orderItem.create({
        data : {order_id : order_id, 
                product_id, 
                quantity, 
                price : product.price
            },
    });
    res.status(201).json(newOrderItem);
};

// delete an orderItem -> delete

// lowk think we need to do all the crud stuff