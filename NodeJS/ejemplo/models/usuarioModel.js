const mongoose = require("../config/dbconn");
const bcrypt = require("bcrypt");

//Esquema para modelo Usuario

const usuarioSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Ingresar un email valido"],
        //match: [/^\S+@\S+\.\S+$/, "Correo electronico invalido"]
    },
    nombre: {
        type: String,
        required: [true, "Ingresar un nombre"],
        maxlength: 30
    },
    apellido: String,  
    password: { 
        type: String,
        required: [true, "Ingresar un password (8 a 12 caracteres)"],
        maxlength: 12,
        minlength: 8,
        //match: [/^(?=.*[A-Z])(?=.*\d).+$/, "El password debe contener al menos 1 mayúscula y 1 numero"]
    } 
});

usuarioSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

usuarioSchema.pre('updateOne', async function (next) {
    this._update.password = await bcrypt.hash(this._update.password, 10);
    next();
});

const usuarioModel = mongoose.model("usuario", usuarioSchema);

module.exports = usuarioModel;