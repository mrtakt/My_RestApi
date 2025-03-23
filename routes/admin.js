__path = process.cwd();
//―――――――――――――――――――――――――――――――――――――――――― ┏ Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

require("../settings");
const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controller/passportLocal")(passport);
const dataweb = require("../model/DataWeb");
const User = require("../model/user");
const bcryptjs = require("bcryptjs");
//_______________________ ┏ Function ┓ _______________________\\
function checkRole(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
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
    items: datas,
  });
});

router.get('/admin/database', async (req, res) => {
  try {
      const dataList = await User.find();
      res.json(dataList);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
router.delete('/deleteuser/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedData = await User.findByIdAndDelete(id);
      if (!deletedData) {
          return res.status(404).json({ message: 'Data not found' });
      }

      res.json({ message: 'Data deleted successfully', deletedData });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
//_______________________ ┏ END ┓ _______________________\\

module.exports = router;
