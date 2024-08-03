import express from 'express';

const router = express.Router();

// GET api/products
router.get('/api/products', (req, res) => {
    // Logic to fetch all products
    console.log(req.signedCookies)
    if (req.signedCookies.name && req.signedCookies.name === 'express') {
        res.send('Get all products')
    }
    else {
        res.status(401).send('Unauthorized');

    }

});

// GET api/products/:id
router.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    // Logic to fetch a specific product by ID
    res.send(`Get product with ID ${id}`);
});

// POST api/products
router.post('/api/products', (req, res) => {
    // Logic to create a new product
    res.send('Create a new product');
});

// PUT api/products/:id
router.put('/api/products:id', (req, res) => {
    const { id } = req.params;
    // Logic to update a specific product by ID
    res.send(`Update product with ID ${id}`);
});

// PATCH api/products/:id
router.patch('/api/products:id', (req, res) => {
    const { id } = req.params;
    // Logic to partially update a specific product by ID
    res.send(`Partially update product with ID ${id}`);
});

// DELETE api/products/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // Logic to delete a specific product by ID
    res.send(`Delete product with ID ${id}`);
});

export default router;