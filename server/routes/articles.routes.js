const express = require("express");
const User = require("../database/models/User");
const Article = require("../database/models/Article");
const Review = require("../database/models/Review");

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const role = req.role;

        if(!userId) {
            return res.status(400).json({ success: false, message: "User ID not found", data: {} });
        }

        if(isNaN(id)) {
            return res.status(400).json({ success: false, message: "Article ID should be a number", data: {} });
        }

        const article = await Article.findByPk(id, {
            include: [{
                model: Review,
                as: "reviews",
                include: [{
                    model: User, // dacă dorești să incluzi și detalii despre recenzor
                    as: "reviewer",
                    attributes: ["id", "username"] // selectează doar câmpurile necesare
                }],
            }],
        });

        if(!article) {
            return res.status(400).json({ success: false, message: "Article not found", data: {} });
        }

        const reviewers = await article.getReviewers();
        const reviewerIds = reviewers.map(el => el.dataValues.id);

        if(role == "author" && article.dataValues.authorId != userId && article.dataValues.status !== "accepted") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        if(role == "reviewer" && !reviewerIds.includes(userId)) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
        }

        if (role == "author" && article.dataValues.authorId != userId) {
            console.log("test");
            article.setDataValue("reviews", []);
        }

        res.status(200).json({ success: true, message: "Article found", data: { article } });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

router.put("/:articleId", async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const userId = req.userId;
        const role = req.role;

        if(isNaN(articleId)) {
            return res.status(400).json({ success: false, message: "Article ID should be a number", data: {} });
        }

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User does not exist", data: {} });
        }

        const article = await Article.findByPk(articleId);

        if(!article) {
            return res.status(404).json({ success: false, message: "Article not found", data: {} });
        }

        const reviewers = await article.getReviewers();
        const reviewerIds = reviewers.map(el => el.dataValues.id);

        if(role == "author" && article.dataValues.authorId != userId) {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }


        if(role == "reviewer" && (!reviewerIds.includes(userId))) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
        }

        await article.update(req.body);

        const fullArticle = await Article.findByPk(article.id, {
            include: [{
                model: Review,
                as: "reviews",
                include: [{
                    model: User, // dacă dorești să incluzi și detalii despre recenzor
                    as: "reviewer",
                    attributes: ["id", "username"] // selectează doar câmpurile necesare
                }],
            }],
        });

        res.status(200).json({ success: true, message: "Article updated ", data: { fullArticle } });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

router.get("/:articleId/reviews", async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const userId = req.userId;
        const role = req.role;

        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found", data: {} });
        }

        const article = await Article.findByPk(articleId);
        if(!article) {
            return res.status(400).json({ success: false, message: "Article not found", data: {} });
        }

        if(role === "author" && article.dataValues.authorId !== userId) {
            return res.status(400).json({ success: false, message: "User not authorized to see reviews for this article", data: {} });
        }

        const reviewers = await article.getReviewers();
        const reviewersIds = reviewers.map(el => el.dataValues.id);

        if(role === "reviewer" && !reviewersIds.includes(userId)) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized to see reviews for this article", data: {} });
        }

        let reviews = null;

        if(role === "author") {
            reviews = await Review.findAll({
                where: {
                    articleId: articleId,
                    status: ["opened", "in_progress"]
                }
            });
        } else if(role === "reviewer"){
            reviews = await Review.findAll({
                where: {
                    articleId: articleId,
                    reviewerId: userId
                }
            });
        } else if(role === "organizer") {
            reviews = await Review.findAll({
                where: {
                    articleId: articleId
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "User role not found", data: {} });
        }

        if(!reviews) {
            return res.status(400).json({ success: false, message: `Reviews for article ${articleId} not found`, data: {} });
        }

        res.status(200).json({ success: true, message: "Success fetching reviews", data: { reviews }});
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

router.post("/:articleId/reviews", async (req, res) => {
    try {
        const articleId = req.params.articleId;
        const userId = req.userId;
        const role = req.role;

        if(role === "author") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found", data: {} });
        }

        const article = await Article.findByPk(articleId);
        if(!article) {
            return res.status(400).json({ success: false, message: "Article not found", data: {} });
        }

        const reviewers = await article.getReviewers();
        const reviewersIds = reviewers.map(el => el.dataValues.id);

        if(role === "reviewer" && !reviewersIds.includes(userId)) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
        }

        const review = await Review.create({
            ...req.body,
            reviewerId: userId,
            articleId: articleId
        });

        const fullReview = await Review.findByPk(review.dataValues.id, {
            include: [
                {
                    model: User,
                    as: "reviewer", // sau ce alias ai definit în asociere
                    attributes: ["id", "username"], // ce câmpuri vrei să iei
                },
            ],
        });

        await article.update({
            status: "needs_revision"
        });

        return res.status(200).json({ success: true, message: "Created review", data: { fullReview } });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

module.exports = router;
