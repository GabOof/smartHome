const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const TEMPERATURE_TOPIC = "home/temperature";
const HEATER_TOPIC = "home/heater/status";

client.on("connect", () => {
  console.log("Cliente conectado ao broker MQTT");
  client.subscribe(TEMPERATURE_TOPIC);
  client.subscribe(HEATER_TOPIC);
});

client.on("message", (topic, message) => {
  if (topic === TEMPERATURE_TOPIC) {
    const { temperature } = JSON.parse(message.toString());
    console.log(`Cliente visualiza temperatura: ${temperature}°C`);
  } else if (topic === HEATER_TOPIC) {
    const { status } = JSON.parse(message.toString());
    console.log(
      `Cliente visualiza status do aquecedor: ${
        status ? "Ligado" : "Desligado"
      }`
    );
  }
});
