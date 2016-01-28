/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "author": "zhuangqh",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      "title": "Sed egestas",
      "author": "zhuangqh",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    },
    {
      "title": "Sed egestas",
      "author": "zhuangqh",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    },
    {
      "title": "Sed egestas",
      "author": "zhuangqh",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    },
    {
      "title": "Sed egestas",
      "author": "zhuangqh",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};

var users = {};

var express = require('express'),
    router = express.Router(),
    debug = require('debug')('blog:api');

module.exports = function (db) {
  debug('api work as normal');
  var blogManager = require('../models/blogServers')(db);

  // GET
  router.get('/posts', function (req, res) {
    var posts = [];
    data.posts.forEach(function (post, i) {
      posts.push({
        id: i,
        author: post.author,
        title: post.title,
        text: post.text
      });
    });
    res.json({
      posts: posts
    });
  });

  router.get('/post/:id', function (req, res) {
    var id = req.params.id;
    if (id >= 0 && id < data.posts.length) {
      res.json({
        post: data.posts[id]
      });
    } else {
      res.json(false);
    }
  });

  router.post('/checkUnique', function (req, res) {
    var user = req.body;
    blogManager.checkUserUnique(user.username)
        .then(function () {
          res.send({isUnique: true});
        })
        .catch(function () {
          res.send({isUnique: false});
        });
  });

  router.get('/hasLogin', function (req, res) {
    var data = {};
    data.isLogin = (req.session && req.session.user);
    res.send(data);
  });

  // POST
  router.post('/post', function (req, res) {
    data.posts.push(req.body);
    res.json(req.body);
  });

  router.post('/regist', function (req, res) {
    var user = req.body;
    debug('about to regist', user);

    blogManager.createUser(user)
        .then(function () {
          req.session.user = user;
          res.send({});
        })
        .catch(function (error) {
          debug('Error occurs in regist');
          res.send({});
        });
    users[user.username] = user;
  });

  router.post('/login', function (req, res) {
    var user = req.body;
    console.log(user);
    blogManager.checkPassword(user)
        .then(function () {
          req.session.user = user;
          res.send({passwordError: false});
        })
        .catch(function () {
          debug("user's password is wrong.");
          res.send({passwordError: true});
        });
  });

  router.post('/logout', function (req, res) {
    delete req.session.user;
    res.send(true);
  });

  // PUT
  router.put('/post/:id', function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
      data.posts[id] = req.body;
      res.json(true);
    } else {
      res.json(false);
    }
  });

  // DELETE
  router.delete('/post/:id', function (req, res) {
    var id = req.params.id;

    if (id >= 0 && id < data.posts.length) {
      data.posts.splice(id, 1);
      res.json(true);
    } else {
      res.json(false);
    }
  });

  return router;
};

