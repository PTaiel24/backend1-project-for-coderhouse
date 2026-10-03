import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT),
  node_env: process.env.NODE_ENV,
  app_name: process.env.APP_NAME,
};

if (!config.port) {
  throw new Error("ERROR: La variable PORT no está definida.");
}
if (!config.node_env) {
  throw new Error("ERROR: La variable NODE_ENV no está definida.");
}

export default config;
