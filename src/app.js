import express from "express";
import serviceRouter from "./routes/services.router.js";
import bookingRouter from "./routes/bookings.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Bienvenido a backend 1",
  });
});

app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "La ruta solicitada no exist4e",
  });
});

export default app;
