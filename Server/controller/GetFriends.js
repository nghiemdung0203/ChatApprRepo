const client = require("../cassanndra-driver");

module.exports.GetFriends = async (req, res) => {
  const user_id = req.query.user_id;

  try {
    // Validate user_id
    if (!user_id) {
      return res.status(400).send("Invalid user_id");
    }

    // Get conversationIDs for the user
    const resultChats = await client.execute(
      "SELECT conversationid FROM chats WHERE user_id = ?",
      [user_id],
      { prepare: true }
    );

    const conversationIDs = resultChats.rows.map((row) => row.conversationid);
    const friendIds = new Set();

    // Get friend IDs for each conversation
    for (const conversationId of conversationIDs) {
      const allIds = await client.execute(
        "SELECT user_id FROM chats WHERE conversationid = ? ALLOW FILTERING",
        [conversationId],
        { prepare: true }
      );

      const userIdSet = new Set([user_id]);
      allIds.rows.forEach((row) => {
        if (!userIdSet.has(row.user_id)) {
          friendIds.add(row.user_id);
        }
      });
    }
    const friendDetails = [];
    for (const friendId of friendIds) {
      const friendInfo = await client.execute(
        "SELECT user_id, username, avatar FROM users WHERE user_id = ? ALLOW FILTERING",
        [friendId],
        { prepare: true }
      );

      if (friendInfo.rows.length > 0) {
        friendDetails.push(friendInfo.rows[0]);
      }
    }
    // Format and return the data
    return res.status(200).send(friendDetails);
  } catch (error) {
    console.error("Error retrieving records:", error);
    return res.status(500).send("Internal Server Error");
  }
};
