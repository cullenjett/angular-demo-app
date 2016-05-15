import config from "../../quickstart.config.js"
import Base from "../shared/quickbase-client"

var quickstart_users = angular.module("quickstart-users", ['ui.router', 'templates']);

import AuthComponent from './auth.component';
quickstart_users.component('auth', AuthComponent);

quickstart_users.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  notAuthenticated: 'auth-not-authenticated'
})

quickstart_users.run(['AuthService', function (AuthService) {
  AuthService.init();
}])

// Check Auth on Nav
quickstart_users.run(function ($rootScope, $state, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if(!next.public){
      if(!AuthService.isLoggedIn()){
        $state.go('app.login')
        event.preventDefault();
      };
    };
  });
})

quickstart_users.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login',
      template: "<auth type='login'></auth>",
      public: true
    })
    .state('app.register', {
      url: '/register',
      templateUrl: 'user-management/register-user.tmpl.html',
      public: true
    })
    .state('app.forgotPassword', {
      url: '/forgotPassword',
      templateUrl: 'user-management/forgot-password.tmpl.html',
      public: true
    })
    .state('app.profile', {
      url: '/profile',
      templateUrl: 'user-management/profile.tmpl.html'
    })
    .state('app.changePassword', { url: '/changePassword',
      templateUrl: 'user-management/change-password.tmpl.html' })

  $urlRouterProvider.otherwise('/login');
})

quickstart_users.controller('ApplicationController', function ($scope, $state, AUTH_EVENTS, AuthService) {
  $scope.isLoggedIn = AuthService.isLoggedIn();

  $scope.logout = AuthService.logout;
  $scope.authService = AuthService;

  $scope.currentUser = AuthService.currentUser();
  $scope.$on(AUTH_EVENTS.loginSuccess, function(){
    $scope.currentUser = AuthService.currentUser();
    $scope.isLoggedIn = true;
    $state.go('app.dashboard')
    $scope.$apply();
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function(){
    $scope.currentUser = null;
    $scope.isLoggedIn = false;
    $state.go('app.login')
  });
})

quickstart_users.directive('equals', function() {
  return {
    restrict: 'A', require: '?ngModel',
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return;

      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
      };
    }
  }
});

quickstart_users.service('Flash', function(){
  this.error = function(message){
    this.display(message, "error");
  };

  this.success = function(message){
    this.display(message, "success");
  };

  this.display = function(message, alertClass){
    $("#alert-flyover").html(message).removeClass("error, success");
    $("#alert-flyover").addClass("in").addClass(alertClass);
    setTimeout(function(){
      $("#alert-flyover").removeClass("in");
    }, 3500);
  }
});

quickstart_users.service('AuthService', function ($http, $rootScope, AUTH_EVENTS, Flash) {
  this.ticket = function(){
    var cookie = BaseHelpers.getCookie("quickstart_session");

    if(cookie){
      return JSON.parse(cookie).ticket;
    };

    return "";
  };

  this.currentUser = function(){
    var cookie = BaseHelpers.getCookie("quickstart_session");

    if(cookie){
      cookie = JSON.parse(cookie);
      cookie["lastLoggedIn"] = BaseHelpers.dateTimeToString(cookie.lastLoggedIn, config.timezone);
      return cookie;
    };

    return "";
  };

  this.isLoggedIn = function(){
    return this.ticket() != "";
  };

  this.init = function(){
    var ticket = this.ticket();

    if(ticket){
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }else{
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    };
  };

  this.login = function (user, onLoginAction){
    $("#signIn").attr("disabled", "disabled").html("Signing in...");

    var currentUser = { username: user.email, password: user.password };
    Base.quickstart.signIn(currentUser, function(response){
      if(response.error){
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

        Flash.error(response.error.message);
        $("#signIn").removeAttr("disabled").html("Sign In");
      }else{
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      };
    });
  };

  this.logout = function () {
    Base.quickstart.signOut(function(response){
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    });
  };

  this.createUser = function(user){
    $("#signUp").attr("disabled", "disabled").html("Processing...");

    var user = { username: user.email, password: user.password };
    Base.quickstart.register(user, function(response){
      if(response.error){
        Flash.error(response.error.message);
        $("#signUp").removeAttr("disabled").html("Register");
      }else{
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      };
    });
  };

  this.changePassword = function(user){
    $("#changePassword").attr("disabled", "disabled").html("Processing...");

    var user = {
      newPassword: user.newPassword,
      currentPassword: user.oldPassword
    };

    Base.quickstart.changePassword(user, function(response){
      if(response.error){
        Flash.error(response.error.message);
        $("#changePassword").removeAttr("disabled").html("Change Password");
      }else{
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Flash.success(response);
      }
    });
  };
})