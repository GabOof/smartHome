const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

const TEMPERATURE_TOPIC = "home/temperature";
const CONTROLLER_HEALTH_TOPIC = "controller/health";
const CONTROLLER_ACTIVATION_TOPIC = "controller/activation";

let primaryHealthy = true;

client.on("connect", () => {
  console.log("Middleware conectado ao broker MQTT");

  // Inscreve-se para monitorar a saúde do controlador primário
  client.subscribe(CONTROLLER_HEALTH_TOPIC);

  // Monitora mensagens de temperatura
  client.subscribe(TEMPERATURE_TOPIC);

  // Ativa o health check
  setInterval(checkControllerHealth, 10000);
});

// Lógica para monitorar a saúde do controlador primário
function checkControllerHealth() {
  if (!primaryHealthy) {
    console.log("Controlador primário falhou! Ativando controlador reserva...");
    activateBackupController(true);
  } else {
    console.log("Controlador primário está saudável.");
    activateBackupController(false);
  }

  // Reseta o estado para esperar novos sinais de vida do primário
  primaryHealthy = false;
}

// Publica um comando para ativar ou desativar o controlador reserva
function activateBackupController(activate) {
  client.publish(
    CONTROLLER_ACTIVATION_TOPIC,
    JSON.stringify({ active: activate }),
    (err) => {
      if (err) {
        console.error("Erro ao publicar comando de ativação:", err);
      } else {
        console.log(
          `Comando enviado ao controlador reserva: ${
            activate ? "Ativar" : "Desativar"
          }`
        );
      }
    }
  );
}

client.on("message", (topic, message) => {
  if (topic === CONTROLLER_HEALTH_TOPIC) {
    primaryHealthy = true; // Recebeu sinal do primário
  }
});
