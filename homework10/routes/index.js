var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:index');
var url = require('url');

module.exports = function (db) {
  var userManager = require('../models/user')(db);

  router.get('/', function (req, res, next) {
    var query = url.parse(req.url, true).query;
    var user = req.session.user;
    if (user && query.hasOwnProperty('username')) {
      if (user.username === query.username)
        res.render('detail', {title: '详情', user: user, errorMsg: null});
      else
        res.render('detail', {title: '详情', user: user, errorMsg: '只能够访问自己的数据'});
    } else {
      next();
    }
  });

  // 登录页面
  router.get('/signin', function (req, res) {
    res.render('signin', {title: '登录', user: {}, error: null});
  });

  // 登录
  router.post('/signin', function (req, res) {
    userManager.findUser(req.body.username, req.body.password)
        .then(function (user) {
          req.session.user = user;
          res.redirect('/detail');
        })
        .catch(function () {
          res.render('signin', {title: '登录', user: {}, error: '用户名密码错误'});
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
  // 防止脚本绕过客户端验证
  // 进行服务器端验证
  router.post('/regist', function (req, res) {
    var user = req.body;
    userManager.checkUser(user)
        .then(userManager.createUser(user))
        .then(function () {
          req.session.user = user;
          res.redirect('/detail');
        })
        .catch(function (error) {
          debug('has error in regist: post');
          res.render('signup', {title: '注册', user: user});
        });
  });

  // 查询是否唯一
  router.post('/api/validate-unique', function (req, res) {
    var check = req.body,
        data = {};
    userManager.checkUnique(check.field, check.value)
        .then(function () {
          debug('success in api ');
          data.isUnique = true;
          res.send(data);
        })
        .catch(function () {
          data.isUnique = false;
          res.send(data);
        });
  });

  router.all('*', function (req, res, next) {
    req.session.user ? next() : res.redirect('/signin');
  });

  router.get('/detail', function (req, res, next) {
    res.render('detail', {title: '详情', user: req.session.user, errorMsg: null});
  });

  return router;
};

