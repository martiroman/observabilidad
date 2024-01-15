const mongoose = require("../config/dbconn");

//Esquema para modelo Producto

const productoSchema = mongoose.Schema({
  codigo: {
    type: Number,
    required: [true, "Introducir el codigo del producto"],
    match: [/^\d{8}$/, "Correo electrónico invalido"]
  },
  nombre: {
    type: String,
    required: [true, "Introducir el nombre del producto"],
  },
  precio: {
    type: Number,
    min: [0, "Introducir un valor mayor a 0"],
  },
  descripcion: {
    type: String,
    maxlength: 200
  },
  categoria: {
    type: mongoose.Schema.ObjectId,
    ref: "categoria",
    required: [true, "Seleccionar la categoria"]
  }

});

productoSchema.virtual("imprimeProducto").get(function () {
  return `${this.codigo} | ${this.nombre} | $ ${this.precio}`;
});

productoSchema.set("toJSON", { getters: true, setters: true, virtuals: true });

//Creacion de modelo y export
const productoModel = mongoose.model("producto", productoSchema);

module.exports = productoModel;