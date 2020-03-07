const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(function notFound(req, res, next) {
  const error = new Error("Not found");
  error.status = 404;

  next(error);
});

app.use(function catchAll(error, req, res, next) {
  error.status = error.status || 500;
  error.message = error.message || "Internal server error.";

  res.status(error.status).send(error.message);
});

app.listen(9000, () => console.log("Server running on port 9000"));
