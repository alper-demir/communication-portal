const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Friendship = sequelize.define('Friendship', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    friendId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Friendship
