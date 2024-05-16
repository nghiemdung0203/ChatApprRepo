const { mqttClient } = require("../Mqtt/mqtt");
const processedMessages = new Set();

module.exports.Consumer = async (socket, id) => {
  try {
    mqttClient.subscribe(id, (err) => {
      if (err) {
        console.error(`Error subscribing to topic ${id}:`, err);
        return;
      }
      console.log(`Subscribed to topic: ${id}`);
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === id) {
        const messageData = JSON.parse(message.toString());
        const messageId = messageData.messageId || `${messageData.conversationid}:${messageData.message}:${messageData.order_sequence}`;

        if (!processedMessages.has(messageId)) {
          processedMessages.add(messageId);
          console.log(`Received message on topic ${topic}:`, messageData);
          socket.emit('messageReceived', messageData)
        } else {
          console.log(`Duplicate message received: ${messageId}`);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
};