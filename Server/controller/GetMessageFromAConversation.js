const client = require("../cassanndra-driver");

module.exports.GetMessageFromAConversation = async (req, res) => {
  const conversationid = req.query.conversationid;
  try {
    await client
      .execute(
        `Select * from messages where conversationid = '${conversationid}' ALLOW FILTERING`
      )
      .then((result) => {
        return res.status(200).send(result.rows);
      });

      
  } catch (error) {
    return res.status(500).send(error);
  }
};
