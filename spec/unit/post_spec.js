
const { sequelize } = require("../../src/db/models/index");
const { Post } = require("../../src/db/models");
const { User } = require("../../src/db/models");

describe("Post", () => {
  beforeEach((done) => {
    this.post;
    this.user;
    sequelize.sync({ force: true }).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "password",
      })
      .then((user) => {
        this.user = user;
      });
    });
  });
    describe("#create()", () => {
        it("should create a post object with a title, body, and assigned topic and user", (done) => {
            Post.create({
                title: "Pros of cryosleep during the long journey",
                body: "1. Not having to answer the 'are we there yet?' question.",
                userId: this.user.id,
            })
            .then((post) => {
              this.post = post;
                expect(post.title).toBe("Pros of cryosleep during the long journey");
                expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
                expect(post.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it("should not create a post with missing title or body", (done) => {
          Post.create({
            title: "Pros of Cryosleep during the long journey",
          })
          .then((post) => {
            done();
          })
          .catch((err) => {
            expect(err.message).toContain("notNull Violation: Post.body cannot be null,");
            done();
          });
        });
    });
    describe("#setUser", () => {
      it("should associate a post and a user together", (done) => {
        User.create({
          email: "email@example.com",
          password: "password",
        })
        .then((newUser) => {
          expect(this.post.userId).toBe(this.user.id);
          this.post.setUser(newUser).then((post) => {
            expect(this.post.userId).toBe(newUser.id);
            done();
          });
        });
      });
    });
    describe("#getUser", () => {
      it("should return the associated topic", (done) => {
        this.post.getUser().then((associatedUser) => {
          expect(associatedUser.email).toBe("starman@tesla.com");
          done();
        });
      });
    });
});
