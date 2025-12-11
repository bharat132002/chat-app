const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const Message = require("./Message");
const FriendRequestModel = require("./friendrequest");

// Initialize models
const FriendRequest = FriendRequestModel(sequelize, DataTypes);

User.hasMany(models.FriendRequest, { foreignKey: "senderId", as: "SentRequests" });
User.hasMany(models.FriendRequest, { foreignKey: "receiverId", as: "ReceivedRequests" });

FriendRequest.belongsTo(models.User, { foreignKey: "senderId", as: "Sender" });
FriendRequest.belongsTo(models.User, { foreignKey: "receiverId", as: "Receiver" });

// Export all models
module.exports = {
  sequelize,
  User,
  Group,
  GroupMember,
  Message,
  FriendRequest
};