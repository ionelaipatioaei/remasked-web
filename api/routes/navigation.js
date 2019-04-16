const express = require("express");
const router = express.Router();

const c = require("../controllers/navigation/c");
const post = require("../controllers/navigation/post");
const profile = require("../controllers/navigation/profile");
const communities = require("../controllers/navigation/communities");
const explore = require("../controllers/navigation/explore");

router.get("/c/:name", c());
router.get("/post/:id", post());
router.get("/profile/:name*?", profile());
router.get("/communities", communities());
router.get("/explore", explore());

module.exports = router;