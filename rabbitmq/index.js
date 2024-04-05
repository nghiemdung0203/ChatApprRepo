const express = require('express');
const { Producer } = require('./queue/producer');
const { Consumer } = require('./queue/consumer');
const { initializeChannel } = require('./queue/rabbitmq');


const app = express();
const port = 4001;

app.use(express.json());

app.get('/consume', async (req, res) => {
    const conversationid = req.query.conversationid;
    const messageArray = [];
    
  
    try {
      const { channel } = await initializeChannel();
      await channel.assertQueue(conversationid);
      await channel.consume(conversationid, (msg) => {
        let mess = JSON.parse(msg.content.toString());
        messageArray.push(mess);
        console.log(mess)
      }, { noAck: true });
      return res.status(200).send(messageArray)
    } catch (error) {
      console.error('Error consuming messages:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

