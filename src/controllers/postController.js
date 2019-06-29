
const postQueries = require("../db/queries.posts.js");

module.exports = {
  new(req, res, next) {
    res.render("posts/new");
  },
  index(req, res, next) {
      postQueries.getAllPosts(
        (posts) => {
              res.render("posts/index", { posts });
        },
        () => errorHandler(res),
      );
  },
  create(req, res, next) {
    let newPost = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id,
    };
    postQueries.addPost(newPost, (err, post) => {
      if (err) {
        res.redirect(500, "/posts/new");
      } else {
        res.redirect(303, `/posts/${post.id}`);
      }
    });
  },
  show(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, "/");
      } else {
        res.render("posts/show", { post });
      }
    });
  },
  destroy(req, res, next) {
    postQueries.deletePost(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/posts/${req.params.id}`);
      } else {
        res.redirect(303, `/topics/`);
      }
    });
  },
  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, '/');
      } else {
        res.render('posts/edit', { post });
      }
    });
  },
  update(req, res, next) {
    postQueries.updatePost(req.params.id, req.body, (err, post) => {
      if (err || post == null) {
        res.redirect(404, `/posts/${req.params.id}/edit`);
      } else {
        res.redirect(`/posts/${req.params.id}`);
      }
    });
  },
};
