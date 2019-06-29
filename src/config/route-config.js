
module.exports = {
    init(app) {
        const staticRoutes = require("../routes/static");
        const postRoutes = require("../routes/posts");
        const userRoutes = require("../routes/users");
        const commentRoutes = require("../routes/comments");
        const validationRoutes = require('../routes/validation');

        app.use(staticRoutes);
        app.use(postRoutes);
        app.use(userRoutes);
        app.use(commentRoutes);
        app.use(validationRoutes);
    },
};
