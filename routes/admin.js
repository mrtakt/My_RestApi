__path = process.cwd();
//―――――――――――――――――――――――――――――――――――――――――― ┏ Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

require("../settings");
const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controller/passportLocal")(passport);
const dataweb = require("../model/DataWeb");
const User = require("../model/user");
//const Users = require('../controller/crud');
const bcryptjs = require("bcryptjs");
//_______________________ ┏ Function ┓ _______________________\\
function checkRole(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
      return next(); // Jika pengguna terautentikasi dan memiliki peran yang sesuai, lanjutkan ke rute berikutnya
    }
    res.redirect("/dashboard");
  };
}
async function getApikey(id) {
  let limit = await dataweb.findOne();
  let users = await User.findOne({ _id: id });
  return {
    apikey: users.apikey,
    username: users.username,
    checklimit: users.limitApikey,
    isVerified: users.isVerified,
    RequestToday: limit.RequestToday,
    email: users.email,
  };
}
//_______________________ ┏ Router GET?POST ┓ _______________________\\

router.get("/admin", checkRole("admin"), async (req, res) => {
  let getinfo = await getApikey(req.user.id);
  let { apikey, username, checklimit, isVerified, RequestToday, email, role } =
    getinfo;
  res.render("admin/admin", {
    username: username,
    verified: isVerified,
    apikey: apikey,
    limit: checklimit,
    RequestToday: RequestToday,
    email: email,
    role: role,
  });
});

//_______________________ ┏ Router CRUD ┓ _______________________\\
router.get("/userdata", checkRole("admin"), async (req, res) => {
  let getinfo = await getApikey(req.user.id);
  const datas = await User.find();
  let { username, isVerified, email, role } = getinfo;
  res.render("admin/datalist", {
    username: username,
    verified: isVerified,
    email: email,
    role: role,
    items: datas
  });
});

router.post('/userdata/', async (req, res) => {
  const { username, password, email, apikey, isVerified, role, limitApikey } = req.body;
  try {
    User.create({ username, password, email, apikey, isVerified, role, limitApikey });
    res.render("admin/datalist", {
      username: username,
      verified: isVerified,
      email: email,
      role: role,
      items: datas
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/users/:_id', async (req, res) => {
    const { _id } = req.params;
    try {
        const deletedItem = await User.findByIdAndDelete(_id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
});
//_______________________ ┏ END ┓ _______________________\\

module.exports = router;




/*const {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  deleteAllUser,
  findUserByCondition
} = require('../controller/crud');
// Create a new product
router.post('/user', createUser);

// Retrieve all User
router.get('/user', getUser);

// Retrieve a single product
router.get('/user/:id', getUserById);

// Update a product
router.put('/user/:id', updateUser);

// Delete a product
router.delete('/user/:id', deleteUser);

// Delete all User
router.delete('/user', deleteAllUser);

// Find User by condition
router.post('/user/search', findUserByCondition);*/