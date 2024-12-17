const { DataTypes } = require("sequelize");
const { sequelize } = require("../server");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM,
            values: ["organizer", "reviewer", "author"],
            validate: {
                isIn: [["organizer", "reviewer", "author"]]
            },
            allowNull: false
        }
    },
    {
        timestamps: true,
        updatedAt: false,
    }
);

module.exports = User;
