const { DataTypes } = require("sequelize");
const { sequelize } = require("../server.js");

const Review = sequelize.define(
    "Review",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        header: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["opened", "in_progress", "closed"],
            defaultValue: "opened",
            validate: {
                isIn: [["opened", "in_progress", "closed"]]
            },
            allowNull: false
        }
    }
);

Review.beforeCreate((review) => {
    review.status = "opened";
});

module.exports = Review;