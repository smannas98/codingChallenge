const { Post } = require("./models");
const { Comment } = require("./models");
const { User } = require("./models");

module.exports = {
  addPost(newPost, callback) {
    return Post.create(newPost).then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getAllPosts(callback, callbackOnError) {
    return Post.all()
    .then((posts) => {
        callback(posts);
    })
    .catch((err) => {
        callbackOnError(err);
    });
},
  getPost(id, callback) {
    return Post.findById(id, {
      include: [
        { model: Comment, as: "comments", include: [
          { model: User },
        ]},
      ],
    })
    .then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deletePost(id, callback) {
    return Post.destroy({
      where: { id },
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    });
  },
  updatePost(id, updatedPost, callback) {
    return Post.findById(id).then((post) => {
      if (!post) {
        return callback("Post not found");
      }
      post.update(updatedPost, {
        fields: Object.keys(updatedPost),
      })
      .then(() => {
        callback(null, post);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },
};
