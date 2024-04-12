const { initializeChannel } = require("../rabbitmq");

module.exports.Producer = async (conversationid, messageData) => {
  const { channel } = await initializeChannel();
  channel.assertQueue(conversationid);
  channel.sendToQueue(conversationid, Buffer.from(messageData));
};