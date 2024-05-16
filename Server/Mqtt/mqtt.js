const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://localhost', {
  username: 'guest',
  password: 'guest'
});

mqttClient.on('connect', () => {
  console.log('MQTT client connected');
});

mqttClient.on('error', (err) => {
  console.error('MQTT client error:', err);
});

module.exports = { mqttClient };