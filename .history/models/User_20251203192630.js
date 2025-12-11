const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
User.hasMany(models.FriendRequest, { foreignKey: "senderId", as: "SentRequests" });
User.hasMany(models.FriendRequest, { foreignKey: "receiverId", as: "ReceivedRequests" });

FriendRequest.belongsTo(models.User, { foreignKey: "senderId", as: "Sender" });
FriendRequest.belongsTo(models.User, { foreignKey: "receiverId", as: "Receiver" });


module.exports = User;
