/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/26
 */

/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/25
 */

var bcrypt = require('bcrypt-nodejs');
var validator = require('../public/javascripts/validator');
var debug = require('debug')('signin:user');
var _ = require('lodash');

// 我的机器无法安装bcrypt-as-promised
// 用了bcrypt-nodejs, 转换成promise时可能有点难懂
// 但是功能没任何问题 :)
module.exports = function (db) {
  var users = db.collection('users');

  return {
    findUser: function (username, password) {
      return users.findOne({username: username}).then(function (user) {
        if (user) { // 若用户存在，进行密码验证
          return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function (err, res) {
              debug('result is :', res);
              return res ? resolve(user) : reject();
            });
          });
        } else {
          return Promise.reject("user doesn't exist");
        }
      });
    },

    // 创建user，并加密密码，返回promise
    createUser: function (user) {
      return function () {
        return new Promise(function (resolve, reject) {
          bcrypt.hash(user.password, null, null, function (err, result) {
            user.password = result;
            return users.insert(user).then(function () {
              return resolve();
            });
          });
        });
      };
    },

    // 查询键是否合法，用户是否已存在, 返回promise
    checkUser: function (user) {
      var formatError = validator.isFormatError(user);
      return new Promise(function (resolve, reject) {
        return formatError ? reject(): resolve(user);
      }).then(function () {
        return users.findOne(checkAttrUnique(user)).then(function (existedUser) {
          debug('existed user: ', existedUser);
          return existedUser ? Promise.reject() : Promise.resolve(user);
        });
      });
    },

    // 查询该键值是否唯一, 返回promise
    checkUnique: function (field, value) {
      var query = {};
      query[field] = value;
      debug('query is ', query);
      return new Promise(function (resolve, reject) {
        return users.findOne(query).then(function (doc) {
          return doc ? reject() : resolve();
        });
      });
    }
  };

};

function checkAttrUnique(user) {
  return {
    $or: _(user).omit('password','repeatPassword').pairs().map(pairToObject).value()
  };
}

function pairToObject(pair) {
  var obj = {};
  obj[pair[0]] = pair[1];
  return obj;
}

