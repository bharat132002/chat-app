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
      type: DataTypes.STRING,
      defaultValue: "member"  // owner | admin | member
    }
  });

  return GroupMember;
};
