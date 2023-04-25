const sequelize = require("../data/db")
const { DataTypes } = require('sequelize');

const Messages = sequelize.define('messages', {
    roomId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }

});

module.exports = Messages;