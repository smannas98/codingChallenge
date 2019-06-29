const request = require('request');
const server = require('../../src/server');
const { sequelize } = require('../../src/db/models/index');
const { Post } = require('../../src/db/models');
const { User } = require('../../src/db/models');

const base = 'http://localhost:3000';

describe('routes : posts', () => {
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
  describe('GET /posts/new', () => {
    it('should render a new post form', (done) => {
      request.get(`${base}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('New Post');
        done();
      });
    });
  });
  describe('POST /posts/create', () => {
    it("should not create a new post that fails validations", (done) => {
      const options = {
        url: `${base}/posts/create`,
        form: {
          title: "a",
          body: "b",
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "a" }})
        .then((post) => {
          expect(post).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
    it('should create a new post and redirect', (done) => {
      const options = {
        url: `${base}/posts/create`,
        form: {
          title: 'Watching snow melt',
          body: 'without a doubt my favorite things to do besides watching paint dry!',
        },
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: 'Watching snow melt' }})
        .then((post) => {
          expect(post).not.toBeNull();
          expect(post.title).toBe('Watching snow melt');
          expect(post.body).toBe('without a doubt my favorite things to do besides watching paint dry!');
          expect(post.topicId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe('GET /posts/:id', () => {
    it('should render a view with the selected post', (done) => {
      request.get(`${base}/posts/${this.post.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain('snowball fighting');
        done();
      });
    });
  });
  describe('POST /posts/:id/destroy', () => {
    it('should delete the post with the associated ID', (done) => {
      expect(this.post.id).toBe(1);
      request.post(`${base}/posts/${this.post.id}/destroy`, (err, res, body) => {
        Post.findById(1).then((post) => {
          expect(err).toBeNull();
          expect(post).toBeNull();
          done();
        });
      });
    });
  });
  describe('GET /posts/:id/edit', () => {
    it('should render a view with an edit post form', (done) => {
      request.get(`${base}/posts/${this.post.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Post");
        expect(body).toContain("snowball fighting");
        done();
      });
    });
  });
  describe('POST /posts/:id/update', () => {
    it('should return a status code 302', (done) => {
      request.post({
        url: `${base}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly.",
        },
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });
    it('should update the post with the given values', (done) => {
      const options = {
        url: `${base}/posts/${this.post.id}/update`,
        form: {
          title: "Snowman Building Competition",
          body: "I love watching them melt slowly.",
        },
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: { id: this.post.id },
        })
        .then((post) => {
          expect(post.title).toBe("Snowman Building Competition");
          done();
        });
      });
    });
  });
});
