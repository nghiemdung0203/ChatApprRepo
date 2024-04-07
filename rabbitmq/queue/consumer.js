const { initializeChannel } = require("./rabbitmq");

module.exports.Consumer = async(conversationid) => {
    const { channel } = await initializeChannel();
    try {
        channel.assertQueue(conversationid);
    channel.consume(conversationid, (msg) => {
        // let mess = JSON.parse(msg.content.toString());
        console.log(msg.content.toString())
      }, { noAck: true });
    console.log("Consumer: ", conversationid)
    } catch (err) {
        console.log(err)
    }
    
}