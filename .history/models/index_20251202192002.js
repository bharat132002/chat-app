const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const Message = require("./Message");
const FriendRequestModel = require("./friendrequest");

// Initialize models
const FriendRequest = FriendRequestModel(sequelize, DataTypes);

// Export all models
module.exports = {
  Sequalize
  sequelize,
  User,
  Group,
  GroupMember,
  Message,
  FriendRequest
};