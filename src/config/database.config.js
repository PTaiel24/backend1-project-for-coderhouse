import mongoose from "mongoose";
import envConfig from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.mongo_uri);
    console.log("Conexion a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar con MongoDB: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
