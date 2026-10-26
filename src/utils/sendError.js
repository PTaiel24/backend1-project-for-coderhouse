const sendError = (error, res) => {
  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Error interno del servidor",
  });
};

export default sendError;
