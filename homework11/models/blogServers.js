/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2016/1/28
 */

var debug = require('debug')('blog:manager'),
    bcrypt = require('bcrypt-nodejs');

module.exports = function (db) {
  var users = db.collection('users');

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

    checkPassword: function (user) {
      return users.findOne({username: user.username}).then(function (ans) {
        return new Promise(function (resolve, reject) {
          bcrypt.compare(user.password, ans.password, function (err, res) {
            debug('password check is : ', res);
            return res ? resolve() : reject();
          });
        });
      });
    }
  };
};
