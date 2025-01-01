const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const HEATER_TOPIC = "home/heater/status";

client.on("connect", () => {
  console.log("Atuador do aquecedor conectado ao broker MQTT");
  client.subscribe(HEATER_TOPIC);
});

client.on("message", (topic, message) => {
  if (topic === HEATER_TOPIC) {
    const status = JSON.parse(message.toString()).status;
    console.log(`Aquecedor está agora: ${status ? "Ligado" : "Desligado"}`);
  }
});
