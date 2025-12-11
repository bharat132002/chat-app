const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const messages = await Message.findAll();
    res.json(messages);
};

exports.postMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
    const message = await Message.create({ sender, receiver, content });
    res.json(message);
};
