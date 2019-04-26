const express = require("express");
const router = express.Router();

const login = require("../controllers/auth/login");
const register = require("../controllers/auth/register");
const logout = require("../controllers/auth/logout");
const recover = require("../controllers/auth/recover");

const actions = require("../controllers/auth/actions");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/recover", recover);

router.post("/add-email", actions.addEmail);
router.post("/change-password", actions.changePassword);
router.post("/change-email", actions.changeEmail);
router.post("/delete", actions.delete);

module.exports = router;