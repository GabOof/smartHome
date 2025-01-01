const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const TEMPERATURE_TOPIC = "home/temperature";
const HEATER_TOPIC = "home/heater/status";

client.on("connect", () => {
  console.log("Controlador primário conectado ao broker MQTT");
  client.subscribe(TEMPERATURE_TOPIC);
});

client.on("message", (topic, message) => {
  if (topic === TEMPERATURE_TOPIC) {
    const { temperature } = JSON.parse(message.toString());
    console.log(`Controlador primário recebeu: ${temperature}°C`);

    // Lógica para ligar/desligar o aquecedor
    const heaterStatus = temperature < 22;
    client.publish(HEATER_TOPIC, JSON.stringify({ status: heaterStatus }));
    console.log(
      `Controlador primário decidiu: ${
        heaterStatus ? "Ligar" : "Desligar"
      } o aquecedor`
    );
  }
});
