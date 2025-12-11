module.exports = (sequelize, DataTypes) => {
    const FriendRequest = sequelize.define("FriendRequest", {
        fromUser: { type: DataTypes.INTEGER, allowNull: false },
        toUser: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING, defaultValue: "pending" }
    });

    return FriendRequest;
};
