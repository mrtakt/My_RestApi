__path = process.cwd()
//―――――――――――――――――――――――――――――――――――――――――― ┏  Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

require('../settings');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../controller/passportLocal')(passport);
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const apiRoutes = require('./api')
const dataweb = require('../model/DataWeb');
const User = require('../model/user');

//_______________________ ┏ Function ┓ _______________________\\

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Login Untuk Melanjutkan !");
        res.redirect('/login');
    }
}

async function getApikey(id) {
    let limit = await dataweb.findOne();
    let users = await User.findOne({_id: id})
    return {apikey: users.apikey, username: users.username, checklimit: users.limitApikey, isVerified : users.isVerified, RequestToday: limit.RequestToday , email: users.email};
}


//_______________________ ┏ Router ┓ _______________________\\

router.get('/', (req, res) => {
        res.render("home");
});

router.get('/dashboard',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("docs", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/profile',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("profile", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});
//_______________________ ┏ Router Docs Api ┓ _______________________\\
router.get('/ai',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/ai", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/downloader',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/downloader", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/textpro',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/textpro", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/photooxy',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/photooxy", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/search',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/search", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/randompic',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/randompic", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/game',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/game", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/textaudio',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/textaudio", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/shortlink',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/shortlink", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});

router.get('/nsfw',  checkAuth, async (req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, checklimit, isVerified , RequestToday , email } = getinfo
    res.render("api/nsfw", { username: username, verified: isVerified, apikey: apikey, limit: checklimit , RequestToday: RequestToday , email: email });
    
});
//_______________________ ┏ Router Docs Api End ┓ _______________________\\

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/login");
    });
  });



router.use(authRoutes);
router.use(apiRoutes);
router.use(adminRoutes);
module.exports = router;


