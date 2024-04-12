const { initializeChannel } = require("./rabbitmq");

module.exports.Producer = async (friend_id, messageData) => {
  const { channel } = await initializeChannel();
};
