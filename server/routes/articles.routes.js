const express = require("express");
const User = require("../database/models/User");
const Article = require("../database/models/Article");

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

        const article = await Article.findByPk(id);

        if(!article) {
            return res.status(400).json({ success: false, message: "Article not found", data: {} });
        }

        const reviewers = await article.getReviewers();
        const reviewerIds = reviewers.map(el => el.dataValues.id);

        if(role == "author" && article.dataValues.authorId != userId) {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        if(role == "reviewer" && !reviewerIds.includes(userId)) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
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

        if(role == "author" && (article.dataValues.authorId != userId || req.body.status != "submitted")) {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        if(role == "reviewer" && (!reviewerIds.includes(userId))) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
        }

        const updatedArticle = await article.update(req.body, {
            returning: true
        });

        res.status(200).json({ success: true, message: "Article updated ", data: { updatedArticle } });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

module.exports = router;
