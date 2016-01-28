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
// GET

exports.posts = function (req, res) {
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
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

exports.checkUnique = function (req, res) {
  var data = {};
  if (Math.random() > 0.5) {
    data.isUnique = true;
  } else {
    data.isUnique = false;
  }
  data.isUnique = true;
  res.send(data);
};

exports.hasLogin = function (req, res) {
  console.log('fuck' + req.session.user);
  var data = {};
  if (!!req.session.user && users.hasOwnProperty(req.session.user.username)) {
    data.isLogin = true;
  } else {
    data.isLogin = false;
  }
  res.send(data);
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

exports.regist = function (req, res) {
  console.log('======================');
  var user = req.body;
  users[user.username] = user;
  console.log(users);
  req.session.user = user;
  res.send({});
};

exports.login = function (req, res) {
  console.log(users);
  var user = req.body;
  console.log(user);
  var data = {
    usernameExist: true,
    passwordError: false
  };
  if (!users.hasOwnProperty(user.username)) {
    console.log('haha1');
    data.usernameExist = false;
  } else if (users[user.username].password != user.password) {
    console.log('ahaha2');
    data.passwordError = true;
  }
  req.session.user = user;
  res.send(data);
};

exports.logout = function (req, res) {
  delete req.session.user;
  res.send(true);
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};