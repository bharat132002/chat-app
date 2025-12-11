const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// MODELS IMPORT
const UserModel = require("./User");
const FriendRequestModel = require("./FriendRequest");
const MessageModel = require("./Message");
const GroupModel = require("./Group");
const GroupMemberModel = require("./GroupMember");


// INIT MODELS
const User = UserModel(sequelize, DataTypes);
const FriendRequest = FriendRequestModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);
const Group = GroupModel(sequelize, DataTypes);
const GroupMember = GroupMemberModel(sequelize, DataTypes);

/* ----------------------------------------------------
   ASSOCIATIONS
-----------------------------------------------------*/

// USER → FRIEND REQUESTS
User.hasMany(FriendRequest, { foreignKey: "senderId", as: "SentRequests" });
User.hasMany(FriendRequest, { foreignKey: "receiverId", as: "ReceivedRequests" });

FriendRequest.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

// 🔥 USER → MESSAGES
User.hasMany(Message, { foreignKey: "senderId", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "ReceivedMessages" });

Message.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

/* ----------------------------------------------------
   EXPORT
-----------------------------------------------------*/
module.exports = {
  sequelize,
  Sequelize,
  User,
  FriendRequest,
  Message,
};
