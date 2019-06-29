const { Comment } = require("./models");
const { Post } = require("./models");
const { User } = require("./models");

module.exports = {
  createComment(newComment, callback) {
    return Comment.create(newComment)
    .then((comment) => {
      callback(null, comment);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deleteComment(req, callback) {
    return Comment.findById(req.params.id)
    .then((comment) => {
      if (req.user) {
        comment.destroy();
        callback(null, comment);
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    });
  },
};
