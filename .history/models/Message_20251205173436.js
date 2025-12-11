module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Message", {
    senderId: { type: DataTypes.INTEGER, allowNull:false },
    receiverId: { type: DataTypes.INTEGER, allowNull:false },
    message: { type: DataTypes.TEXT, allowNull:false }
  });
};
