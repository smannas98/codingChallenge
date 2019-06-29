const express = require("express");
const postController = require("../controllers/postController");
const validation = require("./validation");
const helper = require("../auth/helpers");

const router = express.Router();

router.get("/posts/new", postController.new);
router.get("/posts/:id", postController.show);
router.get("/posts/:id/edit", postController.edit);

router.post("/posts/create",
  helper.ensureAuthenticated,
  validation.validatePosts,
  postController.create);
router.post("/posts/:id/destroy", postController.destroy);
router.post("/posts/:id/update", validation.validatePosts, postController.update);

module.exports = router;
