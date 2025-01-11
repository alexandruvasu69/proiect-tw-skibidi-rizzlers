const express = require("express");
const User = require("../database/models/User");
const Article = require("../database/models/Article");
const Review = require("../database/models/Review");

const router = express.Router();

router.put("/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.userId;
        const role = req.role;
        const { status } = req.body;

        if(role == "author" && status !== "in_progress") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found", data: {} });
        }

        const review = await Review.findByPk(reviewId);
        if(!review) {
            return res.status(400).json({ success: false, message: "Review not found", data: {} });
        }

        const article = await Article.findByPk(review.dataValues.articleId);
        if(!article) {
            return res.status(400).json({ success: false, message: "Article not found", data: {} });
        }

        if(role === "reviewer" && review.dataValues.reviewerId !== userId) {
            return res.status(400).json({ success: false, message: "Reviewer not authorized", data: {} });
        }

        const updatedReview = await review.update({
            status: status
        }, {
            returning: true
        });

        if(status !== "closed") {
            await article.update({
                status: "needs_revision"
            });
        }

        const fullReview = await Review.findByPk(review.dataValues.id, {
            include: [
                {
                    model: User,
                    as: "reviewer", // sau ce alias ai definit în asociere
                    attributes: ["id", "username"], // ce câmpuri vrei să iei
                },
            ],
        });

        res.status(200).json({ success: true, message: "Review updated", data: { fullReview } });
    } catch (error) {
        return res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

module.exports = router;