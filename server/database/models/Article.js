const { DataTypes } = require("sequelize");
const { sequelize } = require("../server.js");

const Article = sequelize.define(
    "Article",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ["submitted", "in_review", "needs_revision", "accepted", "rejected"],
            defaultValue: "submitted",
            validate: {
                isIn: [["submitted", "in_review", "needs_revision", "accepted", "rejected"]]
            },
            allowNull: false
        }
    }
);

Article.beforeCreate((article) => {
    article.status = "submitted";
});

module.exports = Article;