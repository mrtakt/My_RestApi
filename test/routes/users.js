const express = require('express');
const router = express.Router();
const Users = require('./controller/crud');

// Create a new product
router.post('/user', Users.createProduct);

// Retrieve all User
router.get('/user', Users.getAllUser);

// Retrieve a single product
router.get('/user/:id', Users.getOneProduct);

// Update a product
router.put('/user/:id', Users.updateProduct);

// Delete a product
router.delete('/user/:id', Users.deleteProduct);

// Delete all User
router.delete('/user', Users.deleteAllUser);

// Find User by condition
router.post('/user/search', Users.findUserByCondition);

module.exports = router;