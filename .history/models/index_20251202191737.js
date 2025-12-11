const sequelize = require("../config/database");

const User = require("./User");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const Message = require("./Message");
FriendRequest: require("./friendrequest")

module.exports = {
  sequelize,
  User,
  Group,
  GroupMember,
  Message
};