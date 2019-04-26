const express = require("express");
const router = express.Router();

const vote = require("../controllers/interaction/vote");
const subscribe = require("../controllers/interaction/subscribe");
const save = require("../controllers/interaction/save");

const comment = require("../controllers/interaction/comment");
const post = require("../controllers/interaction/post");
const community = require("../controllers/interaction/community");
const throwaway = require("../controllers/interaction/throwaway");

// GENERAL
router.post("/vote", vote);
router.post("/subscribe", subscribe);
router.post("/save", save);
router.post("/throwaway", throwaway);

// COMMENT
router.post("/comment", comment.add);
router.put("/comment", comment.edit);
router.delete("/comment", comment.delete);

// POST
router.post("/post", post.add);
router.put("/post", post.edit);
router.delete("/post", post.delete);

// COMMUNITY
router.post("/community", community.add);
router.put("/community", community.edit);

module.exports = router;