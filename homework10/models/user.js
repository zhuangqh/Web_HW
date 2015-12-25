/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/25
 */

var bcrypt = require('bcrypt-as-promised');
var validator = require('../public/javascripts/validator');
var debug = require('debug')('hw10:user');

module.exports = function (db) {
  var users = db.collection('users');

  return {
    findUser: function (username, password) {
      return users.findOne({username: username}).then(function (user) {
        return user
            ? bcrypt.compare(password, user.password).then(function () {
                return user;
              })
            : Promise.reject("user doesn't exist");
      });
    },
    createUser: function (user) {
      var iteration = 10;
      return bcrypt.hash(user.password, iteration).then(function (hash) {
        user.password = hash;
        return users.insert(user);
      })
    },
    checkUser: function (user) {
      var formatError = validator.isFormatError(user);
      return new Promise(function (reslove, reject) {
        formatError ? reject(): resolve(user);
      }).then(function () {
        return user.findOne(checkAttrUnique(user)).then(function (existedUser) {
          debug('existed user: ', existedUser);
          return existedUser ? Promise.reject("user isn't unique") : Promise.resolve(user);
        });
      });
    }
  }
};