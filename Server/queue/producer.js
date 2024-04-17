const { initializeChannel } = require("../rabbitmq");

module.exports.Producer = async (friendIds, messageData) => {
  const { channel } = await initializeChannel();     
  await channel.assertQueue(friendIds);
  const messageDataJSON = JSON.stringify(messageData);
  await channel.sendToQueue(friendIds, Buffer.from(messageDataJSON));
  await channel.close()
};