const prisma = require('../../src/db/db');
const { connect } = require('../routes/productRoutes');

// get all orders -> get
exports.getAll = async (req, res) => {
const orders = await prisma.order.findMany({
    include: {orderItems: true,}, //show associated items
});
let filteredOrders = orders;
const { customer_id, totalPrice, status} = req.query;
if (customer_id) {
    filteredOrders = filteredOrders.filter((o) => o.customer_id === Number(customer_id));
}
if (totalPrice) {
    const limit = Number(totalPrice);
    filteredOrders = filteredOrders.filter((o) => o.totalPrice <= limit);
}
if (status) {
    filteredOrders = filteredOrders.filter((o) => o.status.toLowerCase().includes(status.toLowerCase()))
}
res.json(filteredOrders);
};

// get one order -> get
exports.getById = async (req, res) => {
const order_id = Number(req.params.order_id);
const order = await prisma.order.findUnique( {
    where : {order_id}, 
    include : {orderItems:true},
});
if (!order) {
    return res.status(404).json({error: "Order not found"})
}
res.json(order)
};

// get total price of an order -> get
exports.totalPrice = async (req, res) => { // taxes are handled in front end to avoid recalling the api
    // same logic from create 
    const order_id = Number(req.params.order_id);
    const order = await prisma.order.findUnique( {
    where : {order_id}, 
    include : {orderItems:true},
    });
    if (!order) {
    return res.status(404).json({error: "Order not found"})
    }
    // new logic 
    let totalPrice = order.totalPrice;
    const orderItems = order.orderItems;
    if (orderItems.length) { // if this list is not empty / len > 0
        const itemsTotal = orderItems.reduce((total, item) => { // use reduce to loop
            return total + item.price * item.quantity;
        }, 0)
        totalPrice += itemsTotal;
    }
    res.json({totalPrice});
};

// create an order -> post
exports.create = async (req, res) => {
const { customer_id, totalPrice, status, orderItems } = req.body;
const newOrder = await prisma.order.create({
    data : { customer_id, totalPrice, status, 
        orderItems : {create : orderItems} }, // include order items when creating order 
    include : {orderItems : true,},
});
res.status(201).json(newOrder);
};

// adding an order item to an existing order -> post (milestone 5)
exports.addItem = async (req, res) => {
    // same logic from create 
    const order_id = Number(req.params.order_id);
    const {product_id, quantity} = req.body;
    if (!product_id || !quantity) {
        return res.status(404).json({error: "product not found"})
    }
    const product = await prisma.product.findUnique( {
        where  : {product_id},
    });
    // create new item
    const newItem = await prisma.orderItem.create({
        data : {
            order_id : order_id,
            product_id, 
            quantity, 
            price : product.price
        },
    });
    res.status(201).json(newItem);
};

// update an order -> put
// this doesnt really handle the updating of orderItems within an order but i think thats okay -> yes devarsh said its okay :)
exports.update = async (req, res) => {
const order_id = Number(req.params.order_id);
const { totalPrice, status } = req.body; // should only update status or price here
const updatedOrder = await prisma.order.update({
    where : {order_id},
    data : { totalPrice, status,
     },
});
res.json(updatedOrder);
};

// delete an order -> delete (cascade handled in prisma schema)
exports.remove = async (req, res) => {
const order_id = Number(req.params.order_id);
await prisma.order.delete({where : {order_id},});
res.status(204).end();
};