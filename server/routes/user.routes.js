const express = require("express");
const User = require("../database/models/User");
const { createUser } = require("../utils.js");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password"]
            }
        });

        res.status(200).json(users);
    } catch(error) {
        res.status(400).json({error: error});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if(isNaN(id)) {
            throw new Error("ID should be a number!");
        }

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ["password"]
            }
        });

        if(user == null) {
            throw new Error("User does not exist!");
        }

        res.status(200).json(user);
    } catch(error) {
        res.status(400).json({error: error});
    }
});

router.post("/", async (req, res) => {
    try {
        const user = createUser(req.body);

        res.status(200).json(user);
    } catch(error) {
        res.status(400).json({error: error});
    }
});

router.put("/:id", async function(req, res) {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            throw new Error("Is is invalid");
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const updatedUser = await user.update(req.body, {
            returning: true,
        });

        delete updatedUser.dataValues.password;

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(400).json({error: "Server error"});
    }
});

router.delete("/:id", async function(req, res) {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            throw new Error("Is is invalid");
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        await user.destroy();

        res.status(200).json({message: "User succesfully deleted"});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: "Server error"});
    }
});

module.exports = router;