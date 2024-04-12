const { getUser_id } = require("../Global Variable/userId");

const { initializeChannel } = require("../rabbitmq");

module.exports.Consumer = async(socket, id) => {
    // const conversationid = req.query.conversation
    

    try {
        const { channel } = await initializeChannel();
        channel.assertQueue(id);
        channel.consume(id, (msg) => {
          socket.emit("messageReceived", msg.content.toString())
        console.log(msg.content.toString())
      }, { noAck: true });
    console.log("Consumer: ", id)
    } catch (err) {
        console.log(err)
    }
    
}           