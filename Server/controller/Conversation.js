const client = require("../cassanndra-driver");
const crypto = require("crypto");

module.exports.Conversation = async (req, res) => {
  const { friend_id, user_id } = req.body;
  try {
    const conversationidFromFriend = await client.execute(
      `Select conversationid from chats where user_id = '${friend_id}' ALLOW FILTERING`
    );
    const conversationIds = conversationidFromFriend.rows.map(
      (row) => row.conversationid
    );
    var conversationidd;
    for (const converationdi of conversationIds) {
      const result = await client.execute(
        `SELECT conversationid FROM juen.chats WHERE user_id = '${user_id}' AND conversationid = '${converationdi}' ALLOW FILTERING`
      );

      if (result.rows.length > 0) {
        conversationidd = result.rows[0].conversationid;
      }
    }

    if (conversationidd) {
      const existedConversation = await client.execute(
        `Select * from conversation where conversationid = ${conversationidd} ALLOW FILTERING` //error
      );

      const Chatinfo = await client.execute(
        `Select * from chats where user_id='${user_id}' AND conversationid='${conversationidd}' ALLOW FILTERING`
      );
      const combinedInfo = {
        conversationid: existedConversation.rows[0].conversationid,
        last_counter: existedConversation.rows[0].last_counter,
        createddate: Chatinfo.rows[0].createddate,
        inick: Chatinfo.rows[0].inick,
        status: Chatinfo.rows[0].status,
        user_id: Chatinfo.rows[0].user_id,
      };
      return res.status(200).send(combinedInfo);
    } else {
      const conversationid = crypto.randomUUID();
      const currentTimestamp = Date.now();
      const last_counter = 0;
      const createConversation = await client.execute(
        `INSERT INTO conversation (conversationid, createddate, last_counter) VALUES (${conversationid}, '${currentTimestamp}', ${last_counter})`
      );

      const userchatid = crypto.randomUUID();
      const createChat = await client.execute(
        `INSERT INTO chats (chatid, conversationid, createddate, status, user_id) VALUES (${userchatid}, '${conversationid}', '${currentTimestamp}', 'Active', '${user_id}')`
      );
      const Friendchatid = crypto.randomUUID();
      const createFriendChat = await client.execute(
        `INSERT INTO chats (chatid, conversationid, createddate, status, user_id) VALUES (${Friendchatid}, '${conversationid}', '${currentTimestamp}', 'Active', '${friend_id}')`
      );
      const Chatinfo = await client.execute(
        `Select * from chats where user_id = '${user_id}' and conversationid = '${conversationid}' ALLOW FILTERING`
      );
      const newcombinedInfo = {
        conversationid: conversationid,
        last_counter: last_counter,
        createddate: currentTimestamp,
        inick: Chatinfo.rows[0].inick,
        status: Chatinfo.rows[0].status,
        user_id: Chatinfo.rows[0].user_id,
      };
      return res.status(200).send(newcombinedInfo);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};
