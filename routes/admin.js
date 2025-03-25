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
      res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
      );
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
/// Menambah Data
router.post("/userdata/tambah", checkRole("admin"),async (req, res) => {
  const { username, password, email, apikey, role, limitApikey } = req.body;
  if (!email || !username || !password || !apikey || !role || !limitApikey) {
      req.flash("error_messages", "Semua Form Harus Diisi !");
      res.redirect('/userdata')
    } else if (username.length < 4) {
      req.flash("error_messages", "Username harus minimal 4 karakter");
      res.redirect('/userdata')
    } else if (username.length > 20) {
      req.flash(
        "error_messages",
        "Limit Username tidak boleh lebih 20 karakter"
      );
      res.redirect('/userdata')
    } else {
      User.findOne(
        { $or: [{ email: email }, { username: username }] },
        function (err, data) {
          if (err) throw err;
          if (data) {
            req.flash("error_messages", "User Sudah Ada, Coba Kembali !");
            res.redirect('/userdata')
          } else {
            bcryptjs.genSalt(12, (err, salt) => {
              if (err) throw err;
              bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                User({
                  username: username,
                  email: email,
                  password: hash,
                  apikey: apikey,
                  limitApikey: limitApikey,
                  role: role,
                }).save((err, data) => {
                  if (err) throw err;
                  req.flash("success_messages", "Akun Berhasil Dibuat !");
                  res.redirect('/userdata')
                });
              });
            });
          }
        }
      );
    }
});
// Menghapus data berdasarkan ID
router.get("/userdata/delete/:_id", checkRole("admin"), async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedItem = await User.findByIdAndDelete(_id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    req.flash("success_messages", "Akun Berhasil Dihapus !");
    res.redirect('/userdata')
  } catch (error) {
    req.flash("error_messages", "Kesalahan Saat Menghapus Data !");
    res.redirect('/userdata')
  }
});
// Mengambil Seluruh Data
router.get('/userdata/all', async (req, res) => {
  try {
      const user = await User.find();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
  }
});
// Mengambil data berdasarkan ID
router.get('/userdata/search/:_id',checkRole("admin"), async (req, res) => {
  const { _id } = req.params;
  try {
      const user = await User.findById(_id);
      if (!user) {
          return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching item', error });
  }
});
// Memperbarui Data Berdasarkan ID
router.post('/userdata/update', async (req, res) => {
  const { _id, username, email, password, apikey, limitApikey, role, isVerified } = req.body;
  try {
  if (!_id) {
        req.flash("error_messages", "ID Tidak ditemukan");
        res.redirect(`/userdata`);
      } else {
        var salt = await bcryptjs.genSalt(12);
        var hash = await bcryptjs.hash(password, salt);
        await User.findOneAndUpdate(
          { _id: _id },
          { $set: { username: username ,
            password : hash,
            email : email,
            apikey : apikey,
            limitApikey : limitApikey,
            role : role
          } }
        );
        req.flash("success_messages", "Data Berhasil Di Update");
        res.redirect("/userdata");
      } 
    } catch (err) {
      res.status(400).json({ message: err.message });
  }   
});
//_______________________ ┏ END ┓ _______________________\\

module.exports = router;

/*const update = User.findByIdAndUpdate(_id);
      update.username = username,
      update.email = email,
      update.apikey = apikey,
      update.limitApikey = limitApikey,
      update.role = role,
      res.redirect('/userdata');*/