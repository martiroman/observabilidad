var express = require("express");
var router = express.Router();
const authToken = require('../middleware/authToken');

const usuarioCtrl = require("../controllers/usuarioController");

router.post("/auth", usuarioCtrl.login);
router.post("/", usuarioCtrl.add);

router.get(
  "/",
  (req, res, next) => authToken.verifyToken(req, res, next),
  usuarioCtrl.getAll
);

router.get(
    "/:id",
    (req, res, next) => authToken.verifyToken(req, res, next),
    usuarioCtrl.getById
);
  
router.put(
  "/:id", 
  (req, res, next) => authToken.verifyToken(req, res, next),
  usuarioCtrl.update
);

module.exports = router;