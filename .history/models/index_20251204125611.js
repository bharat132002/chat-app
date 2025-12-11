const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

/* LOAD MODEL FACTORIES */
const UserModel = require("./User");
const FriendRequestModel = require("./FriendRequest");

/* INIT MODELS */
const User = UserModel(sequelize, DataTypes);
const FriendRequest = FriendRequestModel(sequelize, DataTypes);

/* -------------------------------------------
   ASSOCIATIONS
--------------------------------------------*/

// USER → FRIEND REQUESTS
User.hasMany(FriendRequest, { foreignKey: "senderId", as: "SentRequests" });
User.hasMany(FriendRequest, { foreignKey: "receiverId", as: "ReceivedRequests" });

// FRIEND REQUEST → USER
FriendRequest.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });

module.exports = {
  sequelize,
  User,
  FriendRequest,
};
