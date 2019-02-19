const express = require("express");
const router = express.Router();

const miscController = require("../controllers/misc");

router.get("/about", miscController.about);
router.get("/contact", miscController.contact);
router.get("/apps", miscController.apps);
router.get("/terms-of-use", miscController.termsOfUse);
router.get("/privacy-policy", miscController.privacyPolicy);

module.exports = router;