const ProductoModel = require("../models/productoModel");

// OPENTELEMETRY
//1. Obtain a reference to the OpenTelemetry API.
//const opentelemetry = require("@opentelemetry/api")

// OPENTELEMETRY
//2. Now we can get a tracer object.
//const tracer = opentelemetry.trace.getTracer('Productos')


const getAll = async function (req, res, next) {
  //OPENTELEMETRY
  //3. With tracer, we can use a span builder to create and start new spans.
//  const span = tracer.startSpan('Call to /getAll');
//  span.setAttribute('http.method', 'GET');
 // span.setAttribute('net.protocol.version','1.1');

  try {
    
    const documents = await ProductoModel.find()
    .populate({
      path: "categoria",
      select: "nombre",
    })
    .sort({ codigo: -1 })    
    res.status(200).json(documents);
  } 
  catch (e) {
    next(e);
  }
  //finally {
    //span.end();

  //}
};

const getById = async function (req, res, next) {
  try {
    const document = await ProductoModel.findById(req.params.id);
    res.status(200).json(document);
  } 
  catch (e) {
    next(e);
  }
};

const add = async function (req, res, next) {
  try {
    const product = new ProductoModel(req.body);
    const document = await product.save();

    res.status(201).json(document);
  } 
  catch (e) {
    next(e);
  }
};

const update = async function (req, res, next) {
  try {
    await ProductoModel.updateOne({ _id: req.params.id }, req.body);
    res.status(204).json();
  } 
  catch (e) {
    next(e);
  }
};

const del = async function (req, res, next) {
  try {
    await ProductoModel.deleteOne({ _id: req.params.id });
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
  del,
};