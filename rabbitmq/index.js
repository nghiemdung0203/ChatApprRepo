const express = require('express');
const { Producer } = require('./queue/producer');
const { Consumer } = require('./queue/consumer');
const {initializeChannel} = require('./queue/rabbitmq');


const app = express();
const port = 4001;

app.use(express.json());

var conver = '6b0454db-8954-4c1b-b33b-c8708d495607'
// channel.assertQueue(conversationid);
Consumer(conver)

app.get('/push', async (req, res) => {
    const conversationid = req.query.conversationid;
    const { channel } = await initializeChannel();
    
    await channel.sendToQueue(conver, Buffer.from(conversationid));
  
    return res.status(200).send(conversationid)
  });
  


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});