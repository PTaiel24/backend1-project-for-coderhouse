import express from "express";
import serviceRouter from "./routes/services.router.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Bienvenido a backend 1",
  });
});

app.use("/api/services", serviceRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "La ruta solicitada no existe",
  });
});

export default app;
