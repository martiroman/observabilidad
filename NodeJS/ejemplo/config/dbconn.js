// Conexion a la Base de datos mongoDB

const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://10.40.0.23:27017/mitienda`)
  .then(() => {
    console.log("Conectado a la DB mitienda");
  })
  .catch((error) => console.log(error));

module.exports = mongoose;