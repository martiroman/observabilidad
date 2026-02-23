// Conexion a la Base de datos mongoDB

const mongoose = require("mongoose");

mongoose
  .connect(`mongodb://tiendapc-db.test-nodejs-app:27017/mitienda`)
  .then(() => {
    console.log("Conectado a la DB mitienda");
  })
  .catch((error) => console.log(error));

module.exports = mongoose;