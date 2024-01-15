var express = require("express");
var router = express.Router();
const metricsCtrl = require("../controllers/metricsController");

// PROMETHEUS

router.get("/", metricsCtrl.getMetrics);

module.exports = router;