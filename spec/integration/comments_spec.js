// #1
const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

const { sequelize } = require("../../src/db/models/index");
const { Post } = require("../../src/db/models");
const { User } = require("../../src/db/models");
const { Comment } = require("../../src/db/models");

describe("routes : comments", () => {

  beforeEach((done) => {
    this.user;
    this.post;
    this.comment;
    sequelize.sync({ force: true }).then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
      })
      .then((user) => {
        this.user = user;  // store user

        Post.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          userId: this.user.id,
        })
        .then((post) => {
          this.post = post;

          Comment.create({
            body: "ay caramba!!!!!",
            userId: this.user.id,
            postId: this.post.id,
          })
          .then((coment) => {
            this.comment = coment;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
    describe("POST /posts/:postId/comments/create", () => {

      it("should create a new comment and redirect", (done) => {
        const options = {
          url: `${base}posts/${this.post.id}/comments/create`,
          form: {
            body: "This comment is amazing!"
          }
        };
        request.post(options,
          (err, res, body) => {
            Comment.findOne({where: {body: "This comment is amazing!"}})
            .then((comment) => {
              expect(comment).not.toBeNull();
              expect(comment.body).toBe("This comment is amazing!");
              expect(comment.id).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });
    });
    describe("POST /posts/:postId/comments/:id/destroy", () => {

      it("should delete the comment with the associated ID", (done) => {
        Comment.all()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;

          expect(commentCountBeforeDelete).toBe(1);

          request.post(
           `${base}posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
            expect(res.statusCode).toBe(302);
            Comment.all()
            .then((comments) => {
              expect(err).toBeNull();
              expect(comments.length).toBe(commentCountBeforeDelete - 1);
              done();
            })

          });
        })

      });

    });

  });

});
