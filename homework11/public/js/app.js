'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    var when2 = $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/signUp', {
        templateUrl: 'partials/signUp',
        controller: SignUpCtrl
      }).
      when('/signIn', {
        templateUrl: 'partials/signIn',
        controller: SignInCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);