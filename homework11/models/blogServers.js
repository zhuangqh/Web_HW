/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2016/1/28
 */

var debug = require('debug')('blog:manager'),
    bcrypt = require('bcrypt-nodejs');


module.exports = function (db) {
  var users = db.collection('users');
  var posts = db.collection('posts');
  var numOfPost = 0;

  posts.stats(function (err, stats) {
    if (stats) {
      numOfPost = stats.count;
    }
    debug('There are ' + numOfPost + ' post in database');
  });


  return {
    // 查询用户是否存在
    checkUserUnique: function (username) {
      return users.findOne({username: username})
          .then(function (user) {
            return user ? Promise.reject() : Promise.resolve();
          });
    },
    
    // 创建用户并加密密码
    createUser: function (user) {
      return new Promise(function (resolve, reject) {
        bcrypt.hash(user.password, null, null, function (err, result) {
          user.password = result;
          return users.insert(user).then(function () {
            return resolve();
          });
        });
      });
    },

    // 验证密码是否正确
    checkPassword: function (user) {
      return users.findOne({username: user.username}).then(function (ans) {
        return new Promise(function (resolve, reject) {
          bcrypt.compare(user.password, ans.password, function (err, res) {
            debug('password check is : ', res);
            return res ? resolve() : reject();
          });
        });
      });
    },

    // 增加一条博客
    addPost: function (post) {
      // 增加唯一标识
      post.id = numOfPost++;
      debug('a post add', post);
      return posts.insert(post);
    },

    // 根据id查询博客
    findPostById: function (id) {
      id = parseInt(id);
      return posts.findOne({'id': id}).then(function (post) {
        return post ? Promise.resolve(post) : Promise.reject();
      });
    },

    listPost: function () {
      return posts.find().toArray().then(function (ans) {
        debug('The post in database', ans);
        return Promise.resolve();
      });
    },

    editPostById: function (id, newPost) {
      id = parseInt(id);
      return posts.findOne({'id': id}).then(function (post) {
        newPost._id = post._id;
        debug('the new one is ', newPost);
        return posts.save(newPost);
      });
    },

    // 获取所有博客
    getAllPosts: function () {
      return posts.find().toArray().then(function (ans) {
        ans.forEach(function (post) {
          delete post._id;
        });
        debug('All post is ', ans);
        return Promise.resolve(ans);
      });
    },

    deletePostById: function (id) {
      id = parseInt(id);
      return posts.deleteOne({'id': id});
    },

    // 添加评论
    addComment: function (id, comment) {
      id = parseInt(id);
      return posts.updateOne({'id': id}, {$push: {'comments': comment}});
    }
  };
};
