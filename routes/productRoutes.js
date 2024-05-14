const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST route to create a new product
router.post('/products', async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            imagePath: req.body.imagePath,  // Changed from imageUrl to imagePath
            inStock: req.body.inStock
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to read all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to read a single product by ID
router.get('/products/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// PUT route to update a product by ID
router.put('/products/:id', getProduct, async (req, res) => {
    if (req.body.name != null) {
        res.product.name = req.body.name;
    }
    if (req.body.description != null) {
        res.product.description = req.body.description;
    }
    if (req.body.price != null) {
        res.product.price = req.body.price;
    }
    if (req.body.imagePath != null) {  
        res.product.imagePath = req.body.imagePath;
    }
    if (req.body.inStock != null) {
        res.product.inStock = req.body.inStock;
    }
    try {
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE route to delete a product by ID
router.delete('/products/:id', async (req, res) => {
    try {
      const result = await Product.deleteOne({ _id: req.params.id }); // Using deleteOne method
      if(result.deletedCount === 0) {
        return res.status(404).json({ message: 'No product found with this ID' });
      }
      res.json({ message: 'Deleted Product' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
    
// Middleware function to get product object by ID
async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
}

module.exports = router;
