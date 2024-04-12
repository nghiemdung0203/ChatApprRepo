const amqp = require("amqplib");

let channel = null;

const rabbitSetting = {
  protocol: "amqp",
  hostname: "localhost",
  port: "5672",
  username: "guest",
  password: "guest",
  vhost: "/",
  authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(rabbitSetting);
    channel = await connection.createChannel();
    console.log("RabbitMQ connection established");
    // Now that channel is initialized, assert the queue if needed
    // channel.assertQueue(conversationid);
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err);
  }
};

const initializeChannel = async () => {
  await connectRabbitMQ();
  return { channel };
};

// Export the initializeChannel function
module.exports = {initializeChannel} 

