//―――――――――――――――――――――――――――――――――――――――――― ┏  Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

require("../settings");
const express = require("express");
const translate = require("translate-google");
const Yuki = require("../lib/listdl");
const textto = require("soundoftext-js");
const googleIt = require("google-it");
const { shortText } = require("limit-text-js");
const TinyURL = require("tinyurl");
const emoji = require("emoji-api");
const isUrl = require("is-url");
const { ytMp4, ytMp3 } = require("../lib/y2mate");
const BitlyClient = require("bitly").BitlyClient;
const { convertStringToNumber } = require("convert-string-to-number");
const isImageURL = require("image-url-validator").default;
const { fetchJson, getBuffer } = require("../lib/myfunc");
const isNumber = require("is-number");
const User = require("../model/user");
const dataweb = require("../model/DataWeb");
const router = express.Router();

//―――――――――――――――――――――――――――――――――――――――――― ┏  Info  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\
//  >Creator Yuki MY
//  >Jangan Jual Sc Dan Buang Tulisan ini
//  >Guna Dengan Bijak
//  >Kalau mahu reupload jangan lupa creadit Ya :)
//
//
//  >>>>>Menu<<<<<
// >Dowloader
// >Text Pro
// >Photooxy
// >Sound Of Text
// >Search
// >Random Gambar
// >Game
// >Maker
// >Link Short
// >Infomation
// >Tools
// >Islamic
// >NSFW
//

//―――――――――――――――――――――――――――――――――――――――――― ┏  Function ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

async function cekKey(req, res, next) {
  var apikey = req.query.apikey ;
  if (!apikey)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter apikey",
    });

  let db = await User.findOne({ apikey: apikey });
  if (db === null) {
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Apikey Tidak Terdaftar",
    });
  } else if (!db.isVerified) {
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Silakan Verifikasi Terlebih Dahulu Untuk Menggunakan",
    });
  } else if (db.limitApikey === 0) {
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Apikey Sudah Habis",
    });
  } else {
    return next();
  }
}

async function limitapikey(apikey) {
  await dataweb.updateOne({}, { $inc: { RequestToday: 1 } });
  await User.findOneAndUpdate(
    { apikey: apikey },
    { $inc: { limitApikey: -1 } },
    { upsert: true, new: true }
  );
}
//―――――――――――――――――――――――――――――――――――――――――― ┏  ANIMEBATCH  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\
//―――――――――――――――――――――――――――――――――――――――――― ┏  AI  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\
router.get("/api/ai/bard", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
    let resultt = await fetchJson( `https://api.yanzbotz.my.id/api/ai/bard?query=${text1}`);
    if (!resultt.result);
    limitapikey(req.query.apikey);
    res.json({
      status: true,
      creator: `${creator}`,
      result: resultt.mess,
    });
  });

router.get("/api/ai/gpt3", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
    let resultt = await fetchJson( `https://api.yanzbotz.my.id/api/ai/gpt3?query=${text1}`);
    if (!resultt.result);
    limitapikey(req.query.apikey);
    res.json({
      status: true,
      creator: `${creator}`,
      result: resultt.result,
    });
  });

  router.get("/api/ai/gpt4", cekKey, async (req, res, next) => {
    var text1 = req.query.text;
    if (!text1)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text",
      });
      let resultt = await fetchJson( `https://api.yanzbotz.my.id/api/ai/gpt4?query=${text1}`);
      if (!resultt.result);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: resultt.result,
      });
  });

  router.get("/api/ai/gpt5", cekKey, async (req, res, next) => {
    var text1 = req.query.text;
    if (!text1)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text",
      });
      let resultt = await fetchJson( `https://api.yanzbotz.my.id/api/ai/gpt5?query=${text1}`);
      if (!resultt.result);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: resultt.result,
      });
    });

    router.get("/api/ai/blackbox", cekKey, async (req, res, next) => {
      var text1 = req.query.text;
      if (!text1)
        return res.json({
          status: false,
          creator: `${creator}`,
          message: "[!] masukan parameter text",
        });
        let resultt = await fetchJson( `https://api.yanzbotz.my.id/api/ai/blackbox?query=${text1}`);
        if (!resultt.result);
        limitapikey(req.query.apikey);
        res.json({
          status: true,
          creator: `${creator}`,
          result: resultt.result,
        });
      });
//―――――――――――――――――――――――――――――――――――――――――― ┏  NSFW  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\
router.get("/api/nsfw/xnxxdown", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });
  let resultt = await fetchJson( `https://api.ibeng.tech/api/downloader/xnxx?url=${url}&apikey=BKazM4YXW3`);
  if (!resultt.result);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: resultt.result,
  });
});

router.get("/api/nsfw/xnxxsearch", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  let resultt = await fetchJson( `https://api.ibeng.tech/api/search/xnxx?query=${text1}&apikey=BKazM4YXW3`);
  //if (!resultt.result[0]);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: resultt.data,
  });
});

router.get("/api/nsfw/xvideosdown", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });
  let resultt = await fetchJson( `https://api.ibeng.tech/api/downloader/xvideosdown?url=${url}&apikey=BKazM4YXW3`);
  if (!resultt.result);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: resultt.data,
  });
});

router.get("/api/nsfw/xvideossearch", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  let resultt = await fetchJson( `https://api.ibeng.tech/api/search/xvideossearch?query=${text1}&apikey=BKazM4YXW3`);
  //if (!resultt.result[0]);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: resultt.result,
  });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Dowloader  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/dowloader/fbdown", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });
  Yuki
    .fbdown(url)
    .then((data) => {
      if (!data.Normal_video) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

router.get("/api/dowloader/twitter", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .twitter(url)
    .then((data) => {
      if (!data.thumb) res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

router.get("/api/dowloader/tikok", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .musically(url)
    .then((data) => {
      if (!data) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.noturl);
    });
});

router.get("/api/dowloader/igdowloader", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });
  if (
    !/^((https|http)?:\/\/(?:www\.)?instagram\.com\/(p|tv|reel|stories)\/([^/?#&]+)).*/i.test(
      url
    )
  )
    return res.json(loghandler.noturl);

  Yuki
    .igdl(url)
    .then(async (data) => {
      if (!data) return res.json(loghandler.instgram);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.noturl);
    });
});

router.get("/api/dowloader/yt", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  var mp3 = await ytMp3(url);
  var mp4 = await ytMp4(url);
  if (!mp4 || !mp3) return res.json(loghandler.noturl);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: {
      title: mp4.title,
      desc: mp4.desc,
      thum: mp4.thumb,
      view: mp4.views,
      channel: mp4.channel,
      uploadDate: mp4.uploadDate,
      mp4: {
        result: mp4.result,
        size: mp4.size,
        quality: mp4.quality,
      },
      mp3: {
        result: mp3.result,
        size: mp3.size,
      },
    },
  });
});

router.get("/api/dowloader/soundcloud", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .soundcloud(url)
    .then((data) => {
      if (!data.download) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

router.get("/api/dowloader/mediafire", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .mediafiredl(url)
    .then(async (data) => {
      if (!data) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.noturl);
    });
});

router.get("/api/dowloader/sfilemobi", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .sfilemobi(url)
    .then(async (data) => {
      if (!data) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.noturl);
    });
});

router.get("/api/dowloader/zippyshare", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });

  Yuki
    .zippyshare(url)
    .then(async (data) => {
      if (!data) return res.json(loghandler.noturl);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.noturl);
    });
});

router.get("/api/dowloader/telesticker", cekKey, async (req, res, next) => {
  var url = req.query.url;
  if (!url)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url",
    });
  if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi))
    return res.json(loghandler.noturl);

  Yuki
    .telesticker(url)
    .then((data) => {
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Text Pro  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/textpro/pencil", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-a-sketch-text-effect-online-1044.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/glitch", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-impressive-glitch-text-effects-online-1027.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/blackpink", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-blackpink-logo-style-online-1001.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/berry", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-berry-text-effect-online-free-1033.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/neon", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro("https://textpro.me/neon-light-text-effect-online-882.html", [
      text1,
    ])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/logobear", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/3dchristmas", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro("https://textpro.me/3d-christmas-text-effect-by-name-1055.html", [
      text1,
    ])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/thunder", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/online-thunder-text-effect-generator-1031.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/3dboxtext", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro("https://textpro.me/3d-box-text-effect-online-880.html", [text1])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/glitch2", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  var text2 = req.query.text2;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!text2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text2",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-a-glitch-text-effect-online-free-1026.html",
      [text1, text2]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/glitchtiktok", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  var text2 = req.query.text2;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!text2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text2",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html",
      [text1, text2]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get(
  "/api/textpro/video-game-classic",
  cekKey,
  async (req, res, next) => {
    var text1 = req.query.text;
    var text2 = req.query.text2;
    if (!text1)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text",
      });
    if (!text2)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text2",
      });
    Yuki
      .textpro(
        "https://textpro.me/video-game-classic-8-bit-text-effect-1037.html",
        [text1, text2]
      )
      .then((data) => {
        limitapikey(req.query.apikey);
        res.set({ "Content-Type": "image/png" });
        res.send(data);
      })
      .catch((err) => {
        res.json(loghandler.error);
      });
  }
);

router.get("/api/textpro/marvel-studios", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  var text2 = req.query.text2;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!text2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text2",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-logo-style-marvel-studios-online-971.html",
      [text1, text2]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/ninja-logo", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  var text2 = req.query.text2;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!text2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text2",
    });
  Yuki
    .textpro("https://textpro.me/create-ninja-logo-online-935.html", [
      text1,
      text2,
    ])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/green-horror", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-green-horror-style-text-effect-online-1036.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/magma", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-a-magma-hot-text-effect-online-1030.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/3d-neon-light", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-3d-neon-light-text-effect-online-1028.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/3d-orange-juice", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro(
      "https://textpro.me/create-a-3d-orange-juice-text-effect-online-1084.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/chocolate-cake", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro("https://textpro.me/chocolate-cake-text-effect-890.html", [text1])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/textpro/strawberry", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .textpro("https://textpro.me/strawberry-text-effect-online-889.html", [
      text1,
    ])
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Phootoxy  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/photooxy/flaming", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/shadow-sky", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/metallic", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/other-design/create-metallic-text-glow-online-188.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/naruto", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/pubg", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  var text2 = req.query.text2;
  if (!text2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text2",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html",
      [text1, text2]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/under-grass", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/harry-potter", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get(
  "/api/photooxy/flower-typography",
  cekKey,
  async (req, res, next) => {
    var text1 = req.query.text;
    if (!text1)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text",
      });
    Yuki
      .photooxy(
        "https://photooxy.com/art-effects/flower-typography-text-effect-164.html",
        [text1]
      )
      .then((data) => {
        limitapikey(req.query.apikey);
        res.set({ "Content-Type": "image/png" });
        res.send(data);
      })
      .catch((err) => {
        res.json(loghandler.error);
      });
  }
);

router.get("/api/photooxy/picture-of-love", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/coffee-cup", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/butterfly", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/butterfly-text-with-reflection-effect-183.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/night-sky", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/photooxy/carved-wood", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get(
  "/api/photooxy/illuminated-metallic",
  cekKey,
  async (req, res, next) => {
    var text1 = req.query.text;
    if (!text1)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter text",
      });
    Yuki
      .photooxy(
        "https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html",
        [text1]
      )
      .then((data) => {
        limitapikey(req.query.apikey);
        res.set({ "Content-Type": "image/png" });
        res.send(data);
      })
      .catch((err) => {
        res.json(loghandler.error);
      });
  }
);

router.get("/api/photooxy/sweet-candy", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .photooxy(
      "https://photooxy.com/logo-and-text-effects/sweet-andy-text-online-168.html",
      [text1]
    )
    .then((data) => {
      limitapikey(req.query.apikey);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Sound Of Text  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/soundoftext", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  var lan = req.query.lang;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!lan)
    return res.json({
      status: false,
      creator: `${creator}`,
      message:
        "[!] sila letak format lang dengan betul cek web site https://soundoftext.com/docs untuk lihat code lang",
    });

  textto.sounds
    .create({ text: text1, voice: lan })
    .then((soundUrl) => {
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: soundUrl,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Search  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\


router.get("/api/search/linkgroupwa", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .linkwa(text1)
    .then((data) => {
      if (!data[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/pinterest", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .pinterest(text1)
    .then((data) => {
      if (!data[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/ringtone", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .ringtone(text1)
    .then((data) => {
      if (!data) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/wikimedia", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .wikimedia(text1)
    .then((data) => {
      if (!data[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/wallpaper", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .wallpaper(text1)
    .then((data) => {
      if (!data[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/google", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });

  googleIt({ query: text1 })
    .then((results) => {
      if (!results[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: results,
      });
    })
    .catch((e) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/search/googleimage", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });

  var gis = require("g-i-s");
  gis(text1, logResults);

  function logResults(error, results) {
    if (error) {
      res.json(loghandler.notfound);
    } else {
      if (!results[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: results,
      });
    }
  }
});

router.get("/api/search/ytplay", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });

  let yts = require('../asset/yt-cari');
  let search = await yts(text1);
  let url = search.all[Math.floor(Math.random() * search.all.length)];
  var mp3 = await ytMp3(url.url);
  var mp4 = await ytMp4(url.url);
  if (!mp4 || !mp3) return res.json(loghandler.noturl);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: {
      title: mp4.title,
      desc: mp4.desc,
      thum: mp4.thumb,
      view: mp4.views,
      channel: mp4.channel,
      ago: url.ago,
      timestamp: url.timestamp,
      uploadDate: mp4.uploadDate,
      author: url.author,
      mp4: {
        result: mp4.result,
        size: mp4.size,
        quality: mp4.quality,
      },
      mp3: {
        result: mp3.result,
        size: mp3.size,
      },
    },
  });
});

router.get("/api/search/sticker", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .stickersearch(text1)
    .then((data) => {
      if (!data) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

router.get("/api/search/sfilemobi", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .sfilemobiSearch(text1)
    .then((data) => {
      if (!data) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Random Gambar ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/randomgambar/couplepp", cekKey, async (req, res, next) => {
  let resultt = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/kopel.json"
  );
  let random = resultt[Math.floor(Math.random() * resultt.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: {
      male: random.male,
      female: random.female,
    },
  });
});

router.get("/api/randomgambar/dadu", cekKey, async (req, res, next) => {
  let dadu = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/dadu.json"
  );
  let random = dadu[Math.floor(Math.random() * dadu.length)];
  var result = await getBuffer(random.result);
  limitapikey(req.query.apikey);
  res.set({ "Content-Type": "image/webp" });
  res.send(result);
});

router.get("/api/randomgambar/coffee", cekKey, async (req, res, next) => {
  var result = await getBuffer("https://coffee.alexflipnote.dev/random");
  limitapikey(req.query.apikey);
  res.set({ "Content-Type": "image/png" });
  res.send(result);
});

// Game

router.get("/api/game/tembakgambar", cekKey, async (req, res, next) => {
  Yuki
    .tebakgambar()
    .then((data) => {
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/game/susunkata", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/susunkata.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

router.get("/api/game/tembakbendera", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebakbendera.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

router.get("/api/game/tembakgame", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebakgame.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

router.get("/api/game/tembakkata", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebakkata.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

router.get("/api/game/tembaklirik", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebaklirik.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

router.get("/api/game/tembaklagu", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebaklagu.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});
router.get("/api/game/tembakkimia", cekKey, async (req, res, next) => {
  let ra = await fetchJson(
    "https://raw.githubusercontent.com/AlipBot/data-rest-api/main/tebakkimia.json"
  );
  let ha = ra[Math.floor(Math.random() * ra.length)];
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: ha,
  });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏ Maker ┓ ―――――――――――――――――――――――――――――――――――――――――― \\
router.get("/api/maker/emojimix", cekKey, async (req, res, next) => {
  var emoji1 = req.query.emoji1;
  var emoji2 = req.query.emoji2;
  if (!emoji1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter emoji1",
    });
  if (!emoji2)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter emoji2",
    });

  let data = await fetchJson(
    `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(
      emoji1
    )}_${encodeURIComponent(emoji2)}`
  );
  let jadi = data.results[Math.floor(Math.random() * data.results.length)];
  if (!jadi) return res.json(loghandler.notfound);
  for (let ress of data.results) {
    resul = await getBuffer(ress.url);
    limitapikey(req.query.apikey);
    res.set({ "Content-Type": "image/png" });
    res.send(resul);
  }
});
//―――――――――――――――――――――――――――――――――――――――――― ┏  Link Short  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/linkshort/tinyurl", cekKey, async (req, res, next) => {
  var link = req.query.link;
  if (!link)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter link",
    });

  var islink = isUrl(link);
  if (!islink)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url sahaja",
    });

  TinyURL.shorten(link, function (link, err) {
    if (err) return res.json(loghandler.error);
    limitapikey(req.query.apikey);
    res.json({
      status: true,
      creator: `${creator}`,
      result: link,
    });
  });
});

router.get(
  "/api/linkshort/tinyurlwithalias",
  cekKey,
  async (req, res, next) => {
    var link = req.query.link;
    var alias = req.query.alias;
    if (!link)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter link",
      });
    if (!alias)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter alias",
      });

    var islink = isUrl(link);
    if (!islink)
      return res.json({
        status: false,
        creator: `${creator}`,
        message: "[!] masukan parameter url sahaja",
      });

    const data = { url: link, alias: shortText(alias, 30) };

    TinyURL.shortenWithAlias(data).then(function (link) {
      if (link == "Error") return res.json(loghandler.redy);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: link,
      });
    });
  }
);

router.get("/api/linkshort/cuttly", cekKey, async (req, res, next) => {
  var link = req.query.link;
  if (!link)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter link",
    });
  var islink = isUrl(link);
  if (!islink)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url sahaja",
    });

  let randomapicuttly = apicuttly[Math.floor(Math.random() * apicuttly.length)];
  var hasil = await fetchJson(
    `https://cutt.ly/api/api.php?key=${randomapicuttly}&short=${link}`
  );
  if (!hasil.url) return res.json(loghandler.noturl);
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: hasil.url,
  });
});

router.get("/api/linkshort/bitly", cekKey, async (req, res, next) => {
  var link = req.query.link;
  if (!link)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter link",
    });

  var islink = isUrl(link);
  if (!islink)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url sahaja",
    });

  let randomapibitly = apibitly[Math.floor(Math.random() * apibitly.length)];
  const bitly = new BitlyClient(randomapibitly);
  bitly
    .shorten(link)
    .then(function (result) {
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: result.link,
      });
    })
    .catch(function (error) {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Infomation  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/info/githubstalk", cekKey, async (req, res, next) => {
  var user = req.query.user;
  if (!user)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter user",
    });
  let gitstalk = await fetchJson(`https://api.github.com/users/${user}`);
  if (!gitstalk.login) return res.json(loghandler.notfound);
  limitapikey(req.query.apikey);

  res.json({
    status: true,
    creator: `${creator}`,
    result: gitstalk,
  });
});

router.get("/api/info/waktuksolatmy", cekKey, async (req, res, next) => {
  Yuki
    .watuksolatmy()
    .then((data) => {
      if (!data.Tarikh) return res.json(loghandler.error);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((e) => {
      res.json(loghandler.error);
    });
});

router.get("/api/info/translate", cekKey, async (req, res, next) => {
  var text = req.query.text;
  var lang = req.query.lang;

  if (!text)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (!lang)
    return res.json({
      status: false,
      creator: `${creator}`,
      message:
        "[!] masukan parameter lang.  boleh lihat list bahasa di https://cloud.google.com/translate/docs/languages",
    });

  translate(text, { to: lang })
    .then((data) => {
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json({
        status: false,
        creator: `${creator}`,
        message:
          "[!] masukan parameter lang Dengan Betul.  boleh lihat list bahasa di https://cloud.google.com/translate/docs/languages",
      });
    });
});

router.get("/api/info/emoji", cekKey, async (req, res, next) => {
  var emoji1 = req.query.emoji;
  if (!emoji1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter emoji",
    });
  var hasil = emoji.get(emoji1);
  if (hasil == null)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter emoji dengan 1 emoji sahaja",
    });
  limitapikey(req.query.apikey);
  res.json({
    status: true,
    creator: `${creator}`,
    result: hasil,
  });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Tools ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/tools/ebase64", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (text1.length > 2048)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Maximal 2.048 String!",
    });
  limitapikey(req.query.apikey);

  res.json({
    status: true,
    creator: `${creator}`,
    result: Buffer.from(text1).toString("base64"),
  });
});

router.get("/api/tools/debase64", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (text1.length > 2048)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Maximal 2.048 String!",
    });
  limitapikey(req.query.apikey);

  res.json({
    status: true,
    creator: `${creator}`,
    result: Buffer.from(text1, "base64").toString("ascii"),
  });
});

router.get("/api/tools/ebinary", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (text1.length > 2048)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Maximal 2.048 String!",
    });

  function encodeBinary(char) {
    return char
      .split("")
      .map((str) => {
        const converted = str.charCodeAt(0).toString(2);
        return converted.padStart(8, "0");
      })
      .join(" ");
  }
  limitapikey(req.query.apikey);

  res.json({
    status: true,
    creator: `${creator}`,
    result: encodeBinary(text1),
  });
});

router.get("/api/tools/debinary", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  if (text1.length > 2048)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] Maximal 2.048 String!",
    });

  function decodeBinary(char) {
    return char
      .split(" ")
      .map((str) => String.fromCharCode(Number.parseInt(str, 2)))
      .join("");
  }
  limitapikey(req.query.apikey);

  res.json({
    status: true,
    creator: `${creator}`,
    result: decodeBinary(text1),
  });
});

router.get("/api/tools/ssweb", cekKey, async (req, res, next) => {
  var link = req.query.link;
  if (!link)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter link",
    });

  var islink = isUrl(link);
  if (!islink)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter url sahaja",
    });

  Yuki
    .ssweb(link)
    .then((data) => {
      limitapikey(req.query.apikey);
      if (!data) return res.json(loghandler.notfound);
      res.set({ "Content-Type": "image/png" });
      res.send(data);
    })
    .catch((err) => {
      res.json(loghandler.notfound);
    });
});

router.get("/api/tools/styletext", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text ",
    });
  var text = shortText(text1, 10000);
  Yuki
    .styletext(text)
    .then((data) => {
      if (!data) return res.json(loghandler.error);
      limitapikey(req.query.apikey);

      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

//―――――――――――――――――――――――――――――――――――――――――― ┏  Islamic  ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

router.get("/api/islamic/surah", cekKey, async (req, res, next) => {
  var text1 = req.query.no;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter no",
    });
  Yuki
    .surah(text1)
    .then((data) => {
      if (!data) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

router.get("/api/islamic/tafsirsurah", cekKey, async (req, res, next) => {
  var text1 = req.query.text;
  if (!text1)
    return res.json({
      status: false,
      creator: `${creator}`,
      message: "[!] masukan parameter text",
    });
  Yuki
    .tafsirsurah(text1)
    .then((data) => {
      if (!data[0]) return res.json(loghandler.notfound);
      limitapikey(req.query.apikey);
      res.json({
        status: true,
        creator: `${creator}`,
        result: data,
      });
    })
    .catch((err) => {
      res.json(loghandler.error);
    });
});

module.exports = router;
