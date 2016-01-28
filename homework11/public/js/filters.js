'use strict';

/* Filters */

angular.module('myApp.filter1', []).
  filter('cut', function () {
    return function (value, max) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      return value + ' ...';
    }
  });

angular.module('myApp.filter2', []).
filter('togglePost', function () {
  return function (value, status) {
    if (status) {
      return value;
    } else {
      value = '该内容已被管理员隐藏';
      return value;
    }
  }
});