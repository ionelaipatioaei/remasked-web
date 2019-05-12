const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.status(303).redirect("/");
  } else {
    next();
  }
}

router.get("/login", redirectHome, authController.login);
router.get("/register", redirectHome, authController.register);
router.get("/recover", redirectHome, authController.recover);
router.get("/logout", authController.logout);

module.exports = router;