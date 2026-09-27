import config from "./config/env.config.js";
import { ServiceManager } from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

console.log("Aplicacion iniciada correctamente");
console.log(`Puerto: ${config.port}`);
console.log(`Entorno: ${config.node_env}`);
