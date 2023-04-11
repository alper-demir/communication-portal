const { DataTypes } = require('sequelize');
const sequelize = require("../data/db")

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Comment;