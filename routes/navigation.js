const express = require("express");
const router = express.Router();

const navigationController = require("../controllers/navigation");

router.get("/profile/:name*?", navigationController.profile);
router.get("/c/:name", navigationController.c);
router.get("/c/:name/post/:id", navigationController.post);

router.get("/communities", navigationController.communities);
router.get("/messages", navigationController.messages);
router.get("/notifications", navigationController.notifications);
router.get("/settings", navigationController.settings);

module.exports = router;