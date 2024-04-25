const { getUser_id } = require("../Global Variable/userId");

const { initializeChannel } = require("../rabbitmq");

module.exports.Consumer = async (socket, id) => {

  try {
    const { channel } = await initializeChannel();
    channel.assertQueue(id);
    console.log(id);
    channel.consume(
      id,
      (msg) => {
        const messageData = JSON.parse(msg.content.toString());
        console.log(`Received msg: ${messageData}`);
        socket.emit("messageReceived",messageData);
        console.log(msg.content.toString());
      },
      { noAck: true }
    );
    console.log("Consumer: ", id);
  } catch (err) {
    console.log(err);
  }
};
