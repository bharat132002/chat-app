module.exports = (sequelize, DataTypes) => {
  const FriendRequest = sequelize.define("FriendRequest", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  });

  return FriendRequest;
};
