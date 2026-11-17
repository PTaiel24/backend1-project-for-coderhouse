import express from "express";
import { engine } from "express-handlebars";
import serviceRouter from "./routes/services.router.js";
import bookingRouter from "./routes/bookings.router.js";
import messageRouter from "./routes/messages.router.js";
import viewsRouter from "./routes/views.router.js";
import formatDate from "./utils/formatDate.js";
import sendError from "./utils/sendError.js";

const app = express();

app.use(express.json());

app.engine("handlebars", engine({ helpers: { formatDate } }));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("src/public"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Bienvenido a backend 1",
  });
});

app.use("/views", viewsRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/messages", messageRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "La ruta solicitada no existe",
  });
});

app.use((error, req, res, next) => {
  sendError(error, res);
});

export default app;
