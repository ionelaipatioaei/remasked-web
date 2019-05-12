const express = require("express");
const router = express.Router();

const apiC = require("../api/controllers/navigation/c");
const apiPost = require("../api/controllers/navigation/post");
const apiProfile = require("../api/controllers/navigation/profile");
const apiCommunities = require("../api/controllers/navigation/communities");

const navigationController = require("../controllers/navigation");

const redirectHome = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/");
  } else {
    next();
  }
}

router.get("/c/:name", apiC("render"));
router.get("/post/:id", apiPost("render"));
router.get("/profile/:name*?", apiProfile("render"));
router.get("/communities", redirectHome, apiCommunities("render"));

router.get("/submit/:c", navigationController.submit);
router.get("/create", navigationController.create);
router.get("/messages", redirectHome, navigationController.messages);
router.get("/notifications", redirectHome, navigationController.notifications);
router.get("/settings", navigationController.settings);

module.exports = router;