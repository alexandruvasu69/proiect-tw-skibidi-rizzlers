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

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

User.hasMany(Conference, { foreignKey: "organizerId" });
User.hasMany(Article, {foreignKey: "authorId"});
Conference.hasMany(Article, {foreignKey: "conferenceId"});

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conferences", verifyToken, conferenceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});

