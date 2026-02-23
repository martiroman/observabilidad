var express = require("express");
var router = express.Router();
const authToken = require('../middleware/authToken');
const productoCtrl = require("../controllers/productoController");


router.get("/", productoCtrl.getAll);

router.get("/:id", productoCtrl.getById);

router.post(
  "/",
  (req, res, next) => authToken.verifyToken(req, res, next),
  productoCtrl.add
);

router.put(
  "/:id",
  (req, res, next) => authToken.verifyToken(req, res, next),
  productoCtrl.update
);

router.delete(
  "/:id",
  (req, res, next) => authToken.verifyToken(req, res, next),
  productoCtrl.del
);


module.exports = router;