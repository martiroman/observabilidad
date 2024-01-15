var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// OTEL implementation
require("./instrumentation.js");

const indexRouter = require("./routes/index");
const productoRouter = require("./routes/producto");
const usuarioRouter = require("./routes/usuario");
const categoriaRouter = require("./routes/categoria");
const metricsRouter = require("./routes/metrics");

var app = express();

app.set("secretKey", "MiTienda");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/producto", productoRouter);
app.use("/usuario", usuarioRouter);
app.use("/categoria", categoriaRouter)
app.use("/metrics", metricsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;