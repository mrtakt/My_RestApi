__path = process.cwd()
//―――――――――――――――――――――――――――――――――――――――――― ┏  Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

require('../settings');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../controller/passportLocal')(passport);
const dataweb = require('../model/DataWeb');
const User = require('../model/user');
//_______________________ ┏ Function ┓ _______________________\\
function checkRole(role) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next(); // Jika pengguna terautentikasi dan memiliki peran yang sesuai, lanjutkan ke rute berikutnya
        }
          res.redirect('/dashboard');
    };
  }
async function getApikey(id) {
    let limit = await dataweb.findOne();
    let users = await User.findOne({_id: id})
    return {apikey: users.apikey, username: users.username, checklimit: users.limitApikey, isVerified : users.isVerified, RequestToday: limit.RequestToday , email: users.email};
}
//_______________________ ┏ Router GET?POST ┓ _______________________\\



router.get('/admin', checkRole('admin'), async (req, res) => {
let getinfo =  await getApikey(req.user.id)
let { apikey, username, checklimit, isVerified , RequestToday , email,role } = getinfo
res.render("admin/admin", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email ,role: role});
});
router.get('/admin/userdata', checkRole('admin'), async (req, res) => {
    let getinfo =  await getApikey(req.user.id)
    let { apikey, username, checklimit, isVerified , RequestToday , email,role } = getinfo
    res.render("admin/datauser", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email ,role: role});
    });
//_______________________ ┏ Router CRUD ┓ _______________________\\
// Rute untuk menampilkan data
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find(); // Mengambil semua pengguna dari database
        res.render('users', { users }); // Mengirim data pengguna ke template EJS
    } catch (err) {
        res.status(500).send(err);
    }
});
// Rute untuk menampilkan form tambah pengguna
router.get('/admin/users/new', (req, res) => {
    res.render('newUser ');
});

// Rute untuk menyimpan pengguna baru
router.post('/admin/users', async (req, res) => {
    const { username, email, apikey,limitApikey,role } = req.body;
    const newUser  = new User({ username, email, apikey,limitApikey,role });
    try {
        await newUser .save();
        res.redirect('/users'); // Arahkan kembali ke daftar pengguna
    } catch (err) {
        res.status(500).send(err);
    }
});

// Rute untuk menampilkan form edit pengguna
router.get('/admin/users/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('editUser ', { user });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Rute untuk memperbarui pengguna
router.post('/admin/users/edit/:id', async (req, res) => {
    const { username, email, apikey,limitApikey,role } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { username, email, apikey,limitApikey,role });
        res.redirect('/users'); // Arahkan kembali ke daftar pengguna
    } catch (err) {
        res.status(500).send(err);
    }
});

// Rute untuk menghapus pengguna
router.post('/admin/users/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users'); // Arahkan kembali ke daftar pengguna
    } catch (err) {
        res.status(500).send(err);
    }
});
//_______________________ ┏ END ┓ _______________________\\

  module.exports = router;