module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define("Group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING, // group photo
      allowNull: true
    }
  });

  return Group;
};
