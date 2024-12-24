const express = require("express");
const Conference = require("../database/models/Conference");
const User = require("../database/models/User");
const Article = require("../database/models/Article");
const { Op } = require("sequelize");

const router = express.Router();

const pickTwoRandom = (reviewers) => {
    if (reviewers.length < 2) {
        throw new Error("There should be at least 2 reviewers assigned to the conference");
    }

    const shuffled = [...reviewers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
};

router.get("/", async (req, res) => {
    try {
        const conferences = await Conference.findAll();

        res.status(200).json({ success: true, message: "Success", data: { conferences } });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.role;
        const { name, description, reviewerIds } = req.body;

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User ID not found", data: {} });
        }

        if(role != "organizer") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        if(reviewerIds.length < 2) {
            return res.status(400).json({ success: false, message: "There should be at least 2 reviewers for a conference", data: {} });
        }

        const reviewers = await User.findAll({
            where: { id: reviewerIds, role: "reviewer" },
        });

        if(reviewers.length < 2) {
            return res.status(400).json({ success: false, message: "There should be at least 2 reviewers for a conference", data: {} });
        }

        const conference = await Conference.create({
            name: name,
            description: description,
            organizerId: userId
        });

        await conference.addReviewers(reviewers);

        return res.status(200).json({ success: true, message: "Conference created", data: { conference } });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const role = req.role;

        if(isNaN(id)) {
            return res.status(400).json({ success: false, message: "The ID should be a number", data: {} });
        }

        if(role != "organizer") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        const conference = await Conference.findByPk(id);

        if(!conference) {
            return res.status(400).json({ success: false, message: "The conference doesn't exist", data: {} });
        }

        const updatedConference = await Conference.update(req.body, {
            returning: true
        });

        res.status(200).json({ success: true, message: "Conference updated", data: { updatedConference } });
    } catch (error) {
        res.status(400).json({ success: false, message: "Server error: " + error, data: {} });
    }
});

router.get("/:id/articles", async (req, res) => {
    try {
        const conferenceId = req.params.id;
        const userId = req.userId;
        const role = req.role;

        if(isNaN(conferenceId)) {
            return res.status(400).json({ success: false, message: "Conference ID should be a number", data: {} });
        }

        if(!userId) {
            return res.status(400).json({ success: false, message: "User ID not found", data: {} });
        }

        const conference = await Conference.findByPk(conferenceId);

        if(!conference) {
            return res.status(400).json({ success: false, message: "Conference not found", data: {} });
        }

        let articles;

        if(role === "author") {
            articles = await Article.findAll({
                where: {
                    conferenceId: conferenceId,
                    [Op.or]: [
                        { status: "accepted" },
                        { authorId: userId }
                    ]
                },
            });
        } else if(role === "reviewer") {
            articles = await Article.findAll({
                where: {
                    conferenceId: conferenceId,
                    [Op.or]: [
                        { status: "accepted" },
                        { "$reviewers.id$": userId }
                    ]
                },
                include: [{
                    model: User,
                    as: "reviewers",
                    attributes: [],
                    where: { id: userId },
                    required: false
                }],
                distinct: true,
            });
        } else if (role === "organizer") {
            articles = await Article.findAll({
                where: { conferenceId: conferenceId },
            });
        }

        res.status(200).json({ success: true, message: "Success fetching articles", data: { articles } });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.post("/:id/articles", async (req, res) => {
    try {
        const conferenceId = req.params.id;
        const userId = req.userId;

        if(isNaN(conferenceId)) {
            return res.status(400).json({ success: false, message: "Conference ID should be a number", data: {} });
        }

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User not found", data: {} });
        }

        const conference = await Conference.findByPk(conferenceId);

        if(!conference) {
            return res.status(400).json({ success: false, message: "Conference not found", data: {} });
        }

        const registeredAuthors = await conference.getAuthors();
        const registerAuthorsId = registeredAuthors.map(el => el.dataValues.id);

        if(!registerAuthorsId.includes(userId)) {
            return res.status(400).json({ success: false, message: "Author not registered to conference", data: {} });
        }

        const article = await Article.create({
            ...req.body,
            authorId: userId,
            conferenceId: conferenceId,
        });

        const reviewers = await conference.getReviewers();
        await article.addReviewers(pickTwoRandom(reviewers));

        res.status(200).json({ success: true, message: "Article created", data: {article} });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.post("/:conferenceId/authors", async (req, res) => {
    try {
        const conferenceId = req.params.conferenceId;
        const userId = req.userId;

        const conference = await Conference.findByPk(conferenceId);
        if (!conference) {
            return res.status(400).json({
                success: false,
                message: "Conference not found",
                data: {}
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: {}
            });
        }

        await conference.addAuthor(user);

        res.status(200).json({
            success: true,
            message: "Author registered to conference successfully",
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Server error: " + error,
            data: {}
        });
    }
});

module.exports = router;