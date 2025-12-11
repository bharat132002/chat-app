module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define("GroupMember", {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      defaultValue: "member"
    }
  });

  GroupMember.associate = (models) => {
    GroupMember.belongsTo(models.Group, { foreignKey: "groupId" });
    GroupMember.belongsTo(models.User, { foreignKey: "userId" });
  };

  return GroupMember;
};
