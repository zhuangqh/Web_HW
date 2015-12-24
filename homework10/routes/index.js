var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');

var users = {};

/* GET home page. */
router.get('/regist', function(req, res) {
  res.render('signup', { title: '注册', user: {}, dupMessage: null});
});

router.post('/regist', function (req, res) {
  var user = req.body;
  req.session.user = users[user.username] = user;
  res.redirect('/detail');
});

router.post('/api/validate-unique', function (req, res) {
  var check = req.body,
      data = {};
  console.log(check);
  data.isUnique = validator.isAttrValueUnique(users, check.field, check.value);
  res.send(data);
});

router.all('*', function (req, res, next) {
  req.session.user ? next() : res.redirect('/signin');
});

router.get('/detail', function (req, res, next) {
  res.render('detail', {title: '详情', user: req.session.user});
});

module.exports = router;
