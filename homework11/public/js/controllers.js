'use strict';

/* Controllers */

function IndexCtrl($scope, $http, $location) {
  $scope.hasLogin = false;
  $scope.username = "";

  // 登录之后才可查看内容
  $http.get('/api/hasLogin').
    success(function (data) {
      if (data.isLogin) {
        $scope.hasLogin = true;
        $scope.username = data.username;
        console.log($scope.username);
        $http.get('/api/posts').
          success(function(data, status, headers, config) {
            $scope.posts = data;
          });
      } else {
        $location.url('/signIn');
      }
    });

  // 登出
  $scope.logout = function () {
    $http.post('/api/logout').
        success(function () {
      $location.url('/signIn');
    });
  };

  // 显示或隐藏博客
  $scope.togglePost = function (id, status) {

    $http.post('/api/togglePost/' + id, {curStatus: status})
        .success(function () {
          $http.get('/api/posts').
          success(function(data) {
            $scope.posts = data;
          });
        });
  };
}

function SignUpCtrl($scope, $http, $location) {
  $scope.user = {
    username: "",
    password: "",
    repeatPassword: ""
  };

  var oriUser = angular.copy($scope.user);

  $scope.isUnique = true;
  $scope.check = function(field) {
    return $scope.form[field].$dirty && !$scope.form[field].$valid;
  };

  $scope.checkDupPassword = function() {
    return $scope.user.password != $scope.user.repeatPassword;
  };

  $scope.resetForm = function() {
    $scope.user = angular.copy(oriUser);
  };

  // 确认能否提交表单
  $scope.checkForm = function() {
    return $scope.form.$invalid || !$scope.isUnique;
  };
  // 服务器查询用户名是否重复
  $scope.$watch('user.username', function(newVal, oldVal) {
    $http.post('/api/checkUnique', {username: $scope.user.username}).
      success(function(result) {
        $scope.isUnique = result.isUnique;
      });
  }, true);

  // 向服务器提交注册数据
  $scope.submitData = function() {
    var user = {};
    user.username = $scope.user.username;
    user.password = $scope.user.password;
    $http.post('/api/regist', user).
      success(function () {
        $location.url('/');
      });
  }
}

function SignInCtrl($scope, $http, $location) {
  $scope.user = {
    username: "",
    password: ""
  };
  $scope.usernameExist = true;
  $scope.passwordError = false;

  $scope.$watch('user.username', function(newVal, oldVal) {
      $http.post('/api/checkUnique', {username: $scope.user.username}).
      success(function(result) {
        if ($scope.user.username)
          $scope.usernameExist = !result.isUnique;
        else
          $scope.usernameExist = true;
      });
  }, true);

  // 请求登录
  $scope.submit = function () {
    $http.post('/api/login', $scope.user).
      success(function (res) {
        if (res.passwordError) {
          $scope.passwordError = true;
        } else {
          $location.url('/');
        }
      });
  }
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.form.show = true;
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function AddCommentCtrl ($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $scope.form.show = true;
  $scope.submitComment = function () {
    $http.post('/api/addComment/' + $routeParams.id, $scope.form).
        success(function (data) {
        $location.url('/');
      });
  }
}