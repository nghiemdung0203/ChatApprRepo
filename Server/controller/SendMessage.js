const { send } = require("process");
const client = require("../cassanndra-driver.js");
const crypto = require("crypto");
const {initializeChannel} = require('../../rabbitmq/queue/rabbitmq.js')

module.exports.SendMessage = async (socket, data) => {
  const { conversationid, message, last_counter, reply, sender, status } = data;
  const currentTimestamp = Date.now();
  const messageid = crypto.randomUUID();
  let lastcounter = parseInt(last_counter) + 1;

  const { channel } = await initializeChannel();

  try {
    // First, update the last_counter value in the conversation table
    await client.execute(
      "UPDATE conversation SET last_counter = ? WHERE conversationid = ?",
      [lastcounter, conversationid],
      { prepare: true }
    );

    if (reply === null) {
      // Insert the new message with the updated last_counter value
      await client.execute(
        "INSERT INTO messages (messageid, conversationid, createddate, message, order_sequence, sender, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          messageid,
          conversationid,
          new Date(currentTimestamp),
          message,
          lastcounter,
          sender,
          status,
        ],
        { prepare: true }
      );
      channel.assertQueue(conversationid);
      channel.sendToQueue(conversationid, Buffer.from([messageid, conversationid, new Date(currentTimestamp), message, lastcounter, sender, status]))
    } else {
      // Insert the new message with the updated last_counter value and a reply reference
      await client.execute(
        "INSERT INTO messages (messageid, conversationid, createddate, message, order_sequence, reply, sender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          messageid,
          conversationid,
          new Date(currentTimestamp),
          message,
          lastcounter,
          reply,
          sender,
          status,
        ],
        { prepare: true }
      );
      channel.assertQueue(conversationid);
      channel.sendToQueue(conversationid, Buffer.from(JSON.stringify({messageid, conversationid, message, lastcounter, reply, sender, status})))
    }

    console.log("messageSent", "Gui thanh cong");
    socket.emit("messageSent", "Gui thanh cong");
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
