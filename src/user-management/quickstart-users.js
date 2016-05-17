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
quickstart_users.run(function ($rootScope, $state, Flash, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    $rootScope.currentUser = AuthService.currentUser();

    if(!next.public && !AuthService.isLoggedIn()){
      Flash.error('Please sign in first.');
      $state.go('app.login');
      event.preventDefault();
    };
  });

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
    $rootScope.currentUser = AuthService.currentUser();
    $rootScope.isLoggedIn = true;
    $state.go('app.dashboard');
  });

  $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
    $rootScope.currentUser = null;
    $rootScope.isLoggedIn = false;
    $state.go('app.login');
  });
})

quickstart_users.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login',
      template: "<auth type='signIn'></auth>",
      public: true,
      title: 'Sign In'
    })
    .state('app.register', {
      url: '/register',
      template: "<auth type='register'></auth>",
      public: true,
      title: 'Register'
    })
    .state('app.forgotPassword', {
      url: '/forgot-password',
      templateUrl: 'user-management/forgot-password.tmpl.html',
      public: true,
      title: 'Forgot Password'
    })
    .state('app.profile', {
      url: '/profile',
      templateUrl: 'user-management/profile.tmpl.html',
      title: 'Profile'
    })
    .state('app.changePassword', {
      url: '/change-password',
      templateUrl: 'user-management/change-password.tmpl.html',
      title: 'Change Password'
    })
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

quickstart_users.service('AuthService', function ($http, $rootScope, $q, AUTH_EVENTS, Flash) {
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

  this.attemptAuth = function(type, user) {
    var dfd = $q.defer();
    var currentUser = { username: user.email, password: user.password };

    Base.quickstart[type](currentUser, function(response){
      if (response.error) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        Flash.error(response.error.message);
        dfd.resolve(false);
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        dfd.resolve(true)
      };
    });

    return dfd.promise;
  };

  this.logout = function () {
    Base.quickstart.signOut(function(response){
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
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