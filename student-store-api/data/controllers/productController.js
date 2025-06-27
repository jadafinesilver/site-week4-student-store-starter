const prisma = require('../../src/db/db')

// get all products -> get
exports.getAll = async (req, res) => {
    const products = await prisma.product.findMany();
    const { name, price, category } = req.query;
    let filteredProducts = products; // no filtering by default
    if (name) {
        filteredProducts = filteredProducts.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (price) {
        const limit = Number(price);
        filteredProducts = filteredProducts.filter((p) => p.price <= limit);
    }
    if (category) {
        filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    res.send(filteredProducts);
};

// get one product - by id -> get
exports.getById = async (req, res) => {
    const product_id = Number(req.params.product_id);
    const product = await prisma.product.findUnique({where : {product_id} });
    if (!product) {
        return res.status(404).json({error : "Product Not Found"});
    }
    res.json(product);
};

// create a product -> post
exports.create = async (req, res) => {
  const { name, description, price, image_url, category } = req.body; 
  const newProduct = await prisma.product.create({
    data: { name, description, price, image_url, category },
  });
  res.status(201).json(newProduct);
};

// update a product -> put
exports.update = async (req, res) => {
    const product_id = Number(req.params.product_id);
    const { name, description, price, image_url, category } = req.body;
    const updatedProduct = await prisma.product.update({
        where : {product_id},
        data : {name, description, price, image_url, category},
    });
    res.json(updatedProduct);
};

exports.remove = async (req, res) => {
    const product_id = Number(req.params.product_id);
    await prisma.product.delete({where : {product_id},});
    res.status(204).end();
};