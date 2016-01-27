/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2016/1/27
 */

/**
 * @Author: zhuangqh
 * @Email: zhuangqhc@gmail.com
 * @Create on: 2015/12/24
 */

var validator = {
  form: {
    usernameStatus: false,
    passwordStatus: false,
    repeatPasswordStatus: false
  },

  isFormatError: function (user) {
    for (var key in user) {
      if (user.hasOwnProperty(key)) {
        if (!validator.isFieldValid(key, user[key]))
          return true;
      }
    }
    return false;
  },

  isUsernameValid: function (username){
    return this.form.usernameStatus = /^[a-zA-Z][a-zA-Z0-9_]{5,18}$/.test(username);
  },

  isPasswordValid: function (password) {
    this.password = password;
    return this.form.passwordStatus = /^[a-zA-Z][a-zA-Z0-9_\-]{5,12}$/.test(password);
  },

  isFieldValid: function (fieldname, value) {
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function () {
    for (var field in this.form) {
      if (this.form.hasOwnProperty(field) && this.form[field] === false)
        return false;
    }
    return true;
  },

  isAttrValueUnique: function (registry, key, value) {
    if (key === 'password' || key === 'repeatPassword')
      return true;
    for (var user in registry) {
      if (registry.hasOwnProperty(user) && registry[user][key] == value)
        return false;
    }
    return true;
  }
};

if (typeof module == 'object') {
  module.exports = validator;
}
