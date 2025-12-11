const sequelize = require('../config/database');
const User = require('./User');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const Message = require('./Message');

User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });

User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = { sequelize, User, Group, GroupMember, Message };