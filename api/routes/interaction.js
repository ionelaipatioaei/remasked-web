const express = require("express");
const router = express.Router();

const interactionController = require("../controllers/interaction");
const interactionCommentController = require("../controllers/interactionComment");
const interactionPostController = require("../controllers/interactionPost");

// GENERAL
router.post("/vote", interactionController.vote);

// COMMENT
router.post("/comment", interactionCommentController.commentAdd);
router.put("/comment", interactionCommentController.commentEdit);
router.delete("/comment", interactionCommentController.commentDelete);

// POST
router.post("/post", interactionPostController.postAdd);
router.put("/post", interactionPostController.postEdit);
router.delete("/post", interactionPostController.postDelete);

// COMMUNITY

module.exports = router;