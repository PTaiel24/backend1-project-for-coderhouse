import envConfig from "./config/env.config.js";
import app from "./app.js";
import connectDB from "./config/database.config.js";

async function startServer() {
  await connectDB();

  app.listen(envConfig.port, () => {
    console.log(`Server started on port: ${envConfig.port}`);
    console.log(`Bienvenido a ${envConfig.app_name}`);
  });
}

startServer();

/* Modificar repository para manejar el dao con extends */
