const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const TEMPERATURE_TOPIC = "home/temperature";
const HEATER_TOPIC = "home/heater/status";
const CONTROLLER_ACTIVATION_TOPIC = "controller/activation";

let isActive = false; // Indica se o controlador reserva está ativo

client.on("connect", () => {
  console.log("Controlador reserva conectado ao broker MQTT");

  // Inscreve-se para ativação pelo middleware
  client.subscribe(CONTROLLER_ACTIVATION_TOPIC);

  // Inscreve-se no tópico de temperatura, mas só atuará se ativo
  client.subscribe(TEMPERATURE_TOPIC);
});

client.on("message", (topic, message) => {
  if (topic === CONTROLLER_ACTIVATION_TOPIC) {
    const { active } = JSON.parse(message.toString());
    isActive = active;
    console.log(
      `Controlador reserva foi ${isActive ? "ativado" : "desativado"}`
    );
  }

  if (isActive && topic === TEMPERATURE_TOPIC) {
    const { temperature } = JSON.parse(message.toString());
    handleTemperatureMessage(temperature);
  }
});

function handleTemperatureMessage(temperature) {
  console.log(`Controlador reserva recebeu: ${temperature}°C`);

  // Lógica para ligar/desligar o aquecedor
  const heaterStatus = temperature < 22;
  client.publish(HEATER_TOPIC, JSON.stringify({ status: heaterStatus }));
  console.log(
    `Controlador reserva decidiu: ${
      heaterStatus ? "Ligar" : "Desligar"
    } o aquecedor`
  );
}
