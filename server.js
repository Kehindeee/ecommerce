require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const app = express();
const path = require('path');
const cors = require('cors');

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001' 
}));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Route to create a new product
app.post('/api/products', async (req, res) => {
    try {
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imagePath: req.body.imagePath, 
        inStock: req.body.inStock
      });
      
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Use routes from external file
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

// Listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
