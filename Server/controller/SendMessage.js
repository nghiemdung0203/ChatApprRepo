const { send } = require("process");
const client = require("../cassanndra-driver.js");
const crypto = require("crypto");
const { initializeChannel } = require("../rabbitmq.js");
const { Producer } = require("../queue/producer.js");
const { setUser_id } = require("../Global Variable/userId.js");

module.exports.SendMessage = async (socket, data) => {
  const { conversationid, message, last_counter, reply, sender, status } = data;
  const currentTimestamp = Date.now();
  const messageid = crypto.randomUUID();
  let lastcounter = parseInt(last_counter) + 1;

  // const { channel } = await initializeChannel();

  try {
    // First, update the last_counter value in the conversation table
    await client.execute(
      "UPDATE conversation SET last_counter = ? WHERE conversationid = ?",
      [lastcounter, conversationid],
      { prepare: true }
    );

    if (reply === undefined) {
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

      //Lấy friendIds
      const allIds = await client.execute(
        `Select user_id from chats where conversationid = '${conversationid}' ALLOW FILTERING`
      );
      const uid = await client.execute(
        "Select user_id from users where email = ? ALLOW FILTERING",
        [sender]
      );
      var friendIds;
      const userIdSet = new Set([uid.rows[0].user_id.toString()]);
      allIds.rows.forEach((row) => {
        if (!userIdSet.has(row.user_id)) {
          friendIds = row.user_id;
        }
      });

      Producer(friendIds, {
        conversationid,
        messageid,
        createddate: new Date(currentTimestamp),
        message,
        order_sequence: lastcounter,
        sender,
        status,
      });
      socket.emit("messageSent", {
        conversationid,
        messageid,
        createddate: new Date(currentTimestamp),
        message,
        order_sequence: lastcounter,
        sender,
        status,
      });
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
      const allIds = await client.execute(
        `Select user_id from chats where conversationid = '${conversationid}' ALLOW FILTERING`
      );
      const uid = await client.execute(
        "Select user_id from users where email = ? ALLOW FILTERING",
        [sender]
      );
      var friendIds;
      const userIdSet = new Set([uid.rows[0].user_id.toString()]);
      allIds.rows.forEach((row) => {
        if (!userIdSet.has(row.user_id)) {
          friendIds = row.user_id;
        }
      });

      Producer(friendIds, {
        conversationid,
        messageid,
        createddate: new Date(currentTimestamp),
        message,
        order_sequence: lastcounter,
        sender,
        status,
      });

      socket.emit("messageSent", {
        conversationid,
        messageid,
        createddate: new Date(currentTimestamp),
        message,
        order_sequence: lastcounter,
        sender,
        status,
      });
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
