const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['createdAt', 'ASC']] });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.postMessage = async (data) => {
    try {
        const message = await Message.create(data);
        return message;
    } catch (err) {
        console.log('Error saving message:', err.message);
        return null;
    }
};
