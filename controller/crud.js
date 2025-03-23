const user = require('../model/user');

// Create a new object
const createUser = async (req, res) => {
  try {
    const user = new user(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Retrieve objects (with the condition)
const getUser= async (req, res) => {
  try {
    const user = await user.find(req.query);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Retrieve a single object
const getUserById = async (req, res) => {
  try {
    const user = await user.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an object
const updateUser = async (req, res) => {
  try {
    const user = await user.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an object
const deleteUser = async (req, res) => {
  try {
    const user = await user.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete all objects
const deleteAllUser = async (req, res) => {
  try {
    const result = await user.deleteMany();
    res.status(200).json({ message: `${result.deletedCount} products deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Find all objects by condition
const findUserByCondition = async (req, res) => {
  try {
    const user = await user.find(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUser,
  findUserByCondition
};