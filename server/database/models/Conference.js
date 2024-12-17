const { DataTypes } = require("sequelize");
const { sequelize } = require("../server");

const Conference = sequelize.define(
    "Conference",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: true,
        updatedAt: false,
    }
);

module.exports = Conference;
