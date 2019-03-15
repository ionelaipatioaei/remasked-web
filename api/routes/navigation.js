const express = require("express");
const router = express.Router();

const navigationController = require("../controllers/navigation");

router.get("/c/:name", navigationController.c);
router.get("/post/:id", navigationController.post);

module.exports = router;