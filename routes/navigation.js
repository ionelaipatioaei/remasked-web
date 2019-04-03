const express = require("express");
const router = express.Router();

const navigationControllerApi = require("../api/controllers/navigation");

const navigationController = require("../controllers/navigation");

router.get("/profile/:name*?", navigationController.profile);
router.get("/c/:name", navigationControllerApi.c("render"));
router.get("/c/:name/post/:id", navigationControllerApi.post("render"));
router.get("/submit/:c", navigationController.submit);

router.get("/communities", navigationController.communities);
router.get("/messages", navigationController.messages);
router.get("/notifications", navigationController.notifications);
router.get("/settings", navigationController.settings);

module.exports = router;