const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Import model functions (NOT initialized yet)
const UserModel = require("./User");
// const GroupModel = require("./Group"); 
const FriendRequestModel = require("./friendrequest");

// Initialize models (VERY IMPORTANT)
const User = UserModel(sequelize, DataTypes);
// const Group = GroupModel(sequelize, DataTypes);
// const GroupMember = GroupMemberModel(sequelize, DataTypes);
// const Message = MessageModel(sequelize, DataTypes);
const FriendRequest = FriendRequestModel(sequelize, DataTypes);

/* -------------------------------------------
   ASSOCIATIONS
--------------------------------------------*/

// USER → FRIEND REQUESTS
User.hasMany(FriendRequest, {
  foreignKey: "senderId",
  as: "SentRequests",
});

User.hasMany(FriendRequest, {
  foreignKey: "receiverId",
  as: "ReceivedRequests",
});

// FRIEND REQUEST → USER
FriendRequest.belongsTo(User, {
  foreignKey: "senderId",
  as: "Sender",
});

FriendRequest.belongsTo(User, {
  foreignKey: "receiverId",
  as: "Receiver",
});

/* -------------------------------------------
   EXPORT MODELS
--------------------------------------------*/

module.exports = {
  sequelize,
  User,
  // Group,
  // GroupMember,
  // Message,
  FriendRequest,
};
