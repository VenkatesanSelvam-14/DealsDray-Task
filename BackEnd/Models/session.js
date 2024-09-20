const { DataTypes } = require("sequelize");
const sequelize = require("../databaseConnection");

const session = sequelize.define(
    "Session",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Login",
                key: 'f_sno',
            },
            onDelete: 'CASCADE', 
            onUpdate: 'CASCADE',
        },

        access_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        access_token_expiration: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refresh_token_expiration: {
            type: DataTypes.DATE,
            allowNull: false,
        }

    },
    {
        modelName: 'Session',
        tableName: "session",
        timestamps: true,
    }
);

module.exports = session;
