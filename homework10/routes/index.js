var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var debug = require('debug')('hw10:index');

module.exports = function (db) {
  var userManager = require('../models/user')(db);
  console.log('fuck');

  // 登录页面
  router.get('/signin', function (req, res) {
    res.render('signin', {title: '登录', user: {}, error: null});
  });

  // 登录
  router.post('signin', function (req, res) {
    userManager.fingUser(req.body.username, req.body.password)
        .then(function (user) {
          req.session.user = user;
          res.redirect('/detail');
        })
        .catch(function (error) {
          res.render('signin', {title: '登录', error: '用户名密码错误'});
        });
  });

  // 登出
  router.get('/signout', function (req, res) {
    delete req.session.user;
    res.redirect('/signin');
  });

  // 注册页面
  router.get('/regist', function(req, res) {
    res.render('signup', { title: '注册', user: {}, dupMessage: null});
  });

  // 提交注册信息
  router.post('/regist', function (req, res) {
    var user = req.body;
    userManager.checkUser(user)
        .then(userManager.createUser)
        .then(function () {
          req.session.user = user;
          res.redirect('/detail');
        })
        .catch(function (error) {
          res.render('/regist', {title: '注册', user: user});
        });
  });

  // 查询是否唯一
  router.post('/api/validate-unique', function (req, res) {
    var check = req.body,
        data = {};
    data.isUnique = validator.isAttrValueUnique(users, check.field, check.value);
    res.send(data);
  });

  router.all('*', function (req, res, next) {
    req.session.user ? res.redirect('/regist') : res.redirect('/signin');
  });

  router.get('/detail', function (req, res, next) {
    res.render('detail', {title: '详情', user: req.session.user});
  });
};
