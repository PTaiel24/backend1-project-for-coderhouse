const sendError = (error, res) => {
  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message,
  });
};

export default sendError;
