const { DataTypes } = require('sequelize');
const sequelize = require("../data/db")

const Comment = sequelize.define('comments', {
  content: {
    type: DataTypes.TEXT,
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
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  editedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
});

module.exports = Comment;