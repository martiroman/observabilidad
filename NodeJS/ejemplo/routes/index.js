var express = require('express');
const logger = require('../logger');
var router = express.Router();

router.get('/', function(req, res, next) {
  logger.info('GET / Home hit');
  res.render('index', { title: 'Tienda - PowerCloud' });
});

router.get('/form-producto', (req, res) => {
  res.render('form-producto');
});


module.exports = router;
