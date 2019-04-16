const express = require("express");
const router = express.Router();

const login = require("../controllers/auth/login");
const register = require("../controllers/auth/register");
const logout = require("../controllers/auth/logout");
const recover = require("../controllers/auth/recover");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/recover", recover);

module.exports = router;