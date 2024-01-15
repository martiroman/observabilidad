var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tienda - PowerCloud' });
});

router.get('/form-producto', (req, res) => {
  res.render('form-producto');
});


module.exports = router;
