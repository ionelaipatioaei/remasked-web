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

router.post("/delete", actions.delete);

router.post("/test", (req, res) => {
  const {keepUsername} = req.body;

  if (keepUsername) {
    res.json({error: true});
  } else {
    res.json({error: false});
  }
});

module.exports = router;