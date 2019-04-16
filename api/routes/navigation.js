const express = require("express");
const router = express.Router();

const navigationController = require("../controllers/navigation");

router.get("/c/:name", navigationController.c());
router.get("/post/:id", navigationController.post());
router.get("/profile/:name*?", navigationController.profile());
router.get("/communities", navigationController.communities());
router.get("/explore", navigationController.explore());

module.exports = router;