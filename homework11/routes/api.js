/*
 * Serve JSON to our AngularJS client
 */

var express = require('express'),
    router = express.Router(),
    debug = require('debug')('blog:api');

module.exports = function (db) {
  debug('api work as normal');
  var blogManager = require('../models/blogServers')(db);

  // GET
  router.get('/posts', function (req, res) {
    blogManager.getAllPosts()
        .then(function (posts) {
          res.send(posts);
        })
        .catch(function () {
          debug('fail to get all post');
          res.json(false);
        });
  });

  router.get('/post/:id', function (req, res) {
    var id = req.params.id;

    blogManager.findPostById(id)
        .then(function (post) {
          res.send(post);
        })
        .catch(function () {
          debug('fail to get post ' + id);
        });
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
    if (data.isLogin)
      data.username = req.session.user.username;
    res.send(data);
  });

  // POST
  router.post('/post', function (req, res) {
    var post = req.body;
    post.comments = [];
    post.author = req.session.user.username;
    blogManager.addPost(post)
        .then(function () {
          res.json(req.body);
        })
        .catch(function (error) {
          debug('error in add post', error);
        });
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
  });

  router.post('/login', function (req, res) {
    var user = req.body;
    debug(user, ' about to login');
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

  router.post('/addComment/:id', function (req, res) {
    var id = req.params.id;
    var comment = req.body;
    comment.author = req.session.user.username;

    debug('comment is ', comment);
    blogManager.addComment(id, comment)
        .then(function () {
          res.json(true);
        })
        .catch(function () {
          debug('fail to add comment');
          res.json(false);
        });
    blogManager.listPost();
  });

  // PUT
  router.put('/post/:id', function (req, res) {
    var id = req.params.id,
        newPost = req.body;

    blogManager.editPostById(id, newPost)
        .then(function () {
          res.json(true);
        })
        .catch(function () {
          debug('fail to update post');
          res.json(false);
        });
  });

  // DELETE
  router.delete('/post/:id', function (req, res) {
    var id = req.params.id;

    blogManager.deletePostById(id)
        .then(function () {
          res.json(true);
        })
        .catch(function () {
          debug('fail to delete post ' + id);
          res.json(false);
        });
  });

  return router;
};

