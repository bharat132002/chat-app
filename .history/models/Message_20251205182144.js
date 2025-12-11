module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },{
    timestamps: true,   // <-- IMPORTANT (createdAt, updatedAt auto)
  }
);

  return Message;
};
