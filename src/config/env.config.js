import dotenv from "dotenv";

dotenv.config();

const envConfig = {
  port: Number(process.env.PORT) || 8080,
  node_env: process.env.NODE_ENV || "development",
  app_name: process.env.APP_NAME || "Backend I project for CoderHouse",
  mongo_uri: process.env.MONGO_URI,
};

if (!envConfig.mongo_uri) {
  throw new Error(
    "ERROR: Falta configurar MONGO_URI en las variables de entorno",
  );
}

if (!envConfig.port) {
  throw new Error("ERROR: La variable PORT no está definida.");
}
if (!envConfig.node_env) {
  throw new Error("ERROR: La variable NODE_ENV no está definida.");
}

export default envConfig;
