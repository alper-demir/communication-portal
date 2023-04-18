const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const FriendRequest = sequelize.define('FriendRequest', {
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = FriendRequest;
