const express = require("express");
const path = require("path");
​
/**
 * Constants
 */
​
const port = process.env.PORT || 3000;
​
/**
 * Initialize the App.
 */
​
const app = express();
​
/**
 * Mount the middleware
 */
​
app.use(express.static(path.join(__dirname, "public")));
​
/**
 * Mount routes.
 */
​
app.get("/", function ping(req, res) { 
    res.sendStatus(200)
})
​
/**
 * Mount the error handlers.
 */
​
app.use(function notFound(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
​
  next(err);
});
​
app.use(function catchAll(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || "Internal Server Error";
​
  console.error(err.message);
​
  res.status(err.status).json({
    status: err.status,
    message: err.message
  });
});
​
/**
 * Start the server.
 */
​
if (module === require.main) {
  app.listen(port, () => {
    console.log(`Express running on port ${port}`);
  });
}