const express = require("express");
const Conference = require("../database/models/Conference");
const User = require("../database/models/User");
const Article = require("../database/models/Article");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const conferences = await Conference.findAll();

        res.status(200).json({ success: true, message: "Success", data: { conferences } });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.get("/:id/articles", async (req, res) => {
    try {
        const conferenceId = req.params.id;
        console.log(conferenceId);
        const userId = req.userId;

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

        const articles = await Article.findAll({
            where: {
                conferenceId: conferenceId
            }
        });

        res.status(200).json(articles);
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.post("/:id/articles", async (req, res) => {
    try {
        const conferenceId = req.params.id;
        const userId = req.userId;
        const role = req.role;

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

        const article = await Article.create({
            ...req.body,
            authorId: userId,
            conferenceId: conferenceId,
        });

        res.status(200).json({ success: true, message: "Article created", data: {article} });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.role;

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User ID not found", data: {} });
        }

        if(role != "organizer") {
            return res.status(400).json({ success: false, message: "User not authorized", data: {} });
        }

        const conference = await Conference.create({
            ...req.body,
            organizerId: userId
        });

        return res.status(400).json({ success: false, message: "Conference created", data: { conference } });
    } catch (error) {
        res.status(400).json({ success: false, message: error, data: {} });
    }
});

module.exports = router;