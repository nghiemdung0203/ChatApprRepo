const { mqttClient } = require("../Mqtt/mqtt");

module.exports.Producer = async (topic, messageData) => {
  try {
    const messageDataJSON = JSON.stringify(messageData);
    
    // Publish the message with the specified QoS level
    mqttClient.publish(topic, messageDataJSON, { qos: 2 }, (err) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log(`Message published to topic: ${topic}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
};
