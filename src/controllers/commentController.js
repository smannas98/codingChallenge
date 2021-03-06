const commentQueries = require("../db/queries.comments.js");

module.exports = {
  create(req, res, next) {
    if (req.user) {
      let newComment = {
        body: req.body.body,
        userId: req.user.id,
        postId: req.params.postId,
      };
      commentQueries.createComment(newComment, (err, comment) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect("/users/sign_in");
    }
  },
  destroy(req, res, next) {
    commentQueries.deleteComment(req, (err, comment) => {
      if (err) {
        res.redirect(err, req.headers.referer);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  },
};
