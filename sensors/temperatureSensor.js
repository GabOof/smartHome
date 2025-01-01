const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const TEMPERATURE_TOPIC = "home/temperature";

function publishTemperature() {
  const temperature = Math.floor(Math.random() * 10) + 20; // Gera temperatura entre 20 e 30
  client.publish(TEMPERATURE_TOPIC, JSON.stringify({ temperature }));
  console.log(`Temperatura publicada: ${temperature}°C`);
}

client.on("connect", () => {
  console.log("Sensor de temperatura conectado ao broker MQTT");
  setInterval(publishTemperature, 5000); // Publica temperatura a cada 5 segundos
});
