var express = require('express');
const path = require('path');
var router = express.Router();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../views/index.html'));
  // res.render('/views/index.html',{title: 'Hey'});
});

router.get('/index', function (req, res) {
  // console.log('req', req);
  if (req.query.id) console.log('req', req.query.id);
  res.sendFile(path.join(__dirname, '/../views/index.html'));
  // res.render('index');
});

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '/../views/login.html'));
  // res.render('login');
});

module.exports = router;