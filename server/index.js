const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const conferenceRoutes = require("./routes/conference.routes.js");
const User = require("./database/models/User.js");
const Conference = require("./database/models/Conference.js");
const { verifyToken } = require("./utils.js");
const Article = require("./database/models/Article.js");
const articleRoutes = require("./routes/articles.routes.js");
const Review = require("./database/models/Review.js");
const reviewRoutes = require("./routes/reviews.routes.js");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

User.hasMany(Conference, { foreignKey: "organizerId" });
User.hasMany(Article, {foreignKey: "authorId"});
Article.belongsTo(User, { as: "author", foreignKey: "authorId" });
User.hasMany(Review, {foreignKey: "reviewerId"});
Review.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });
Conference.hasMany(Article, {foreignKey: "conferenceId"});
Article.hasMany(Review, {as: "reviews", foreignKey: "articleId"});
Review.belongsTo(Article, { foreignKey: "articleId"});


Conference.belongsToMany(User, {
    through: "ConferenceAuthors",
    as: "authors",
    foreignKey: "conferenceId",
    otherKey: "userId"
});

User.belongsToMany(Conference, {
    through: "ConferenceAuthors",
    as: "authoredConferences",
    foreignKey: "userId",
    otherKey: "conferenceId"
});

Conference.belongsToMany(User, {
    through: "ConferenceReviewers",
    as: "reviewers",
    foreignKey: "conferenceId",
    otherKey: "userId"
});

User.belongsToMany(Conference, {
    through: "ConferenceReviewers",
    as: "reviewedConferences",
    foreignKey: "userId",
    otherKey: "conferenceId"
});

Article.belongsToMany(User, {
    through: "ArticleReviewers",
    as: "reviewers",
    foreignKey: "articleId",
    otherKey: "userId"
});

User.belongsToMany(Article, {
    through: "ArticleReviewers",
    as: "reviewedArticles",
    foreignKey: "userId",
    otherKey: "articleId"
});

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conferences", verifyToken, conferenceRoutes);
app.use("/articles", verifyToken, articleRoutes);
app.use("/reviews", verifyToken, reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});

