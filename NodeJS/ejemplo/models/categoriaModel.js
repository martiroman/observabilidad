const mongoose = require("../config/dbconn");

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "Introducir el nombre de la categoria"]
  }
});

module.exports = mongoose.model("categoria", categoriaSchema);