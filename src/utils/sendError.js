const sendError = (error, res) => {
  let statusCode = error.statusCode || 500;

  if (error.name === "ValidationError" || error.name === "CastError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Error interno del servidor",
  });
};

export default sendError;
