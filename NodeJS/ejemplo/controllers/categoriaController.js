const categoriaModel = require("../models/categoriaModel");

const getAll = async function(req, res, next) {
  try{
    const categorias = await categoriaModel.find();
    res.status(200).json(categorias);
  }
  catch(e){
    next(e);
  }
};

const getById = async function (req, res, next) {
  try {
    const categoria = await categoriaModel.findById(req.params.id);
    res.status(200).json(categoria);
  } 
  catch (e) {
    next(e);
  }
};

const add = async function(req, res, next) {
  try{
    const document = new categoriaModel(req.body);

    const response = await document.save();
    res.status(201).json(response);
  }
  catch(e){
    next(e);
  }
};

const update = async function (req, res, next) {
  try {
    await categoriaModel.updateOne({ _id: req.params.id }, req.body);
    res.status(204).json();
  } 
  catch (e) {
    next(e);
  }
};

const del = async function (req, res, next) {
  try {
    await categoriaModel.deleteOne({ _id: req.params.id });
    res.status(204).json();
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
  del
};
