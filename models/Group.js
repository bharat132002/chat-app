module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define("Group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING, // store filepath / url
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Group.associate = (models) => {
    Group.hasMany(models.GroupMember, { foreignKey: "groupId", as: "members" });
  };

  return Group;
};
