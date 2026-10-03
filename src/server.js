import config from "./config/env.config.js";
import app from "./app.js";

app.listen(config.port, () => {
  console.log(`Server started on port: ${config.port}`);
  console.log(`Bienvenido a ${config.app_name}`);
});
