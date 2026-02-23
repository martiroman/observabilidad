const UsuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAll = async function (req, res, next) {
  try {
    const usuarios = await UsuarioModel.find();
    res.status(200).json(usuarios);
  } 
  catch (e) {
    next(e);
  }
};

const getById = async function (req, res, next) {
  try {
    const document = await UsuarioModel.findById(req.params.id);
    res.status(200).json(document);
  } 
  catch (e) {
    next(e);
  }
};

const add = async function (req, res, next) {
  try {
    const document = new UsuarioModel(req.body);
    const response = await document.save();

    res.status(201).json(response);
  } 
  catch (e) {
    next(e);
  }
};

const update = async function (req, res, next) {
  try {
    await UsuarioModel.updateOne({ _id: req.params.id }, req.body);
    res.status(204).json();
  } 
  catch (e) {
    next(e);
  }
};

const login = async function (req, res, next) {
  try {
    const document = await UsuarioModel.findOne({ email: req.body.email });
    
    if (document) {
      if (bcrypt.compareSync(req.body.password, document.password)) {
        const token = jwt.sign(
          { userId: document._id },
            req.app.get("secretKey"),
          {
            expiresIn: "4h",
          }
        );
        res.status(200).json(token);
        return;
      } 
    }
    return res.status(401).json({ message: "El email y/o contraseña son incorrectos" });
  } 
  catch (e) {
      next(e);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  login
};