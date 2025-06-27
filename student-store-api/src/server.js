const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT; // move to .env
const productRoutes = require("../data/routes/productRoutes");
const orderRoutes = require("../data/routes/orderRoutes");
const orderItemRoutes = require("../data/routes/orderItemRoutes");
const cors = require("cors");

const corsOption = {
  origin : "http://localhost:5173"
};
app.use(cors(corsOption)); // connecting
app.use(express.json());
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/orderItems", orderItemRoutes);


app.get('/', (req, res) => {
    res.send("hello world");
})


app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
});


