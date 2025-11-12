const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./database/models/User");

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader?.split(" ")[1];

    if (!token) {
        return res.status(404).json({ success: false, message: "Token not found", data: {} });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Unauthorized - Invalid token", data: {} });
        }

        req.userId = decoded.id;
        req.role = decoded.role;

        next();
    });
};

const createUser = async ({ username, password, role }) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({
        username,
        role,
        password: hash
    });

    delete user.dataValues.password;

    return user;
};

module.exports = {
    verifyToken,
    createUser
};