var express = require("express");
var router = express.Router();
const authToken = require('../middleware/authToken');
const categoriaCtrl = require("../controllers/categoriaController");

router.get("/", categoriaCtrl.getAll);
router.get("/:id", categoriaCtrl.getById);
router.post(
  "/",
  (req, res, next) => authToken.verifyToken(req, res, next),
  categoriaCtrl.add
  );
router.put(
  "/:id",
  (req, res, next) => authToken.verifyToken(req, res, next),
  categoriaCtrl.update
);  
router.delete(
  "/:id",
  (req, res, next) => authToken.verifyToken(req, res, next),
  categoriaCtrl.del
);

module.exports = router;
