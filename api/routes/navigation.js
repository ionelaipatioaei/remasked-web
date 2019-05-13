const express = require("express");
const router = express.Router();

const c = require("../controllers/navigation/c");
const post = require("../controllers/navigation/post");
const profile = require("../controllers/navigation/profile");
const communities = require("../controllers/navigation/communities");
const explore = require("../controllers/navigation/explore");

const random = require("../controllers/navigation/random");
const search = require("../controllers/navigation/search");

router.get("/c/:name", c());
router.get("/post/:id", post());
router.get("/profile/:name*?", profile());
router.get("/communities", communities());
router.get("/explore", explore());

router.get("/random", random);
router.get("/search", search);

const cache = require("../cache/query");

router.get("/cache", (req, res) => {

  // cache.setex("c:pretty_earth:0:popular:user:undefined", 100, JSON.stringify({hey: 123}));
  cache.del(["c:pretty_earth:0:popular:user:undefined", "c:pretty_earth2:0:popular:user:undefined"]);
  // res.json({c: 123});
});

module.exports = router;