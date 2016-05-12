(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "AISQuickStartCRM",
  "description": "QuickStart demo application.",
  "client": "AIS",
  "username": "kith",
  "origin": "",
  "authors": ["khensel@advantagequickbase.com", "zsiglin@advantagequickbase.com"],
  "bootstrap": "./src/main.js",
  "timezone": "eastern",
  "baseConfig": {
    "quickstart": "true",
    "realm": "ais",
    "token": "",
    "async": "callback",
    "databaseId": "bkqdhycdy",
    "tables": {
      "customers": {
        "dbid": "bkqdhyceg",
        "rid": "3",
        "quickstart": {
          "username": "21",
          "password": "38",
          "key": "39",
          "name": "42",
          "lastLoggedIn": "40",
          "restricted": "46"
        }
      },
      "activities": {
        "dbid": "bkqdhycek",
        "rid": "3",
        "type": "7",
        "customerName": "8",
        "date": "6",
        "quickstart": {
          "viewKey": "34",
          "modifyKey": "35"
        }
      }      
    }
  }
}
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = require('../../../app.json')["baseConfig"];

var db = new Base(config);
exports.default = db;

},{"../../../app.json":1}],3:[function(require,module,exports){
'use strict';

var _quickbaseClient = require('./quickbase-client');

var _quickbaseClient2 = _interopRequireDefault(_quickbaseClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../../../app.json');


angular.module('templates', []);
var quickstart_users = angular.module("quickstart-users", ['ngRoute', 'templates']);

quickstart_users.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  notAuthenticated: 'auth-not-authenticated'
});

quickstart_users.run(['AuthService', function (AuthService) {
  AuthService.init();
}]);

// Check Auth on Nav
quickstart_users.run(function ($rootScope, AUTH_EVENTS, AuthService, $location) {
  $rootScope.$on('$routeChangeStart', function (event, next) {

    console.log("TODO...THIS SHOULD ONLY LOAD ONCE.");

    if (!next.public) {
      if (!AuthService.isLoggedIn()) {
        $location.path("/login");
        event.preventDefault();
      };
    };
  });
});

quickstart_users.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/login', { template: '<login-dialog></login-dialog>', public: true }).when('/register', { template: '<register-user></register-user>', public: true }).when('/forgotPassword', { template: '<forgot-password></forgot-password>', public: true }).when('/changePassword', { template: '<change-password></change-password>' }).when('/profile', { template: '<profile></profile>' }).otherwise({ redirectTo: '/login' });
});

quickstart_users.controller('ApplicationController', function ($scope, $route, $location, AUTH_EVENTS, AuthService) {
  $scope.isLoggedIn = AuthService.isLoggedIn();

  $scope.logout = AuthService.logout;

  $scope.currentUser = AuthService.currentUser();
  $scope.$on(AUTH_EVENTS.loginSuccess, function () {
    $scope.currentUser = AuthService.currentUser();
    $scope.isLoggedIn = true;
    $location.path("/");
    $scope.$apply();
  });

  $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
    $scope.currentUser = null;
    $scope.isLoggedIn = false;
    $location.path("/login");
    $scope.$apply();
  });
});

// ------------------------ Login Dialog Directive ------------------------
quickstart_users.directive('loginDialog', function (AUTH_EVENTS, AuthService) {
  return {
    templateUrl: 'partials/quickstart/login-form-template.html',
    link: function link(scope) {
      scope.authService = AuthService;
    }
  };
});

quickstart_users.directive('registerUser', function (AuthService) {
  return {
    templateUrl: 'partials/quickstart/register-user-template.html',
    link: function link(scope, element, attr) {
      scope.authService = AuthService;
    }
  };
});

quickstart_users.directive('forgotPassword', function (AuthService) {
  return {
    templateUrl: 'partials/quickstart/forgot-password-template.html',
    link: function link(scope, element, attr) {
      scope.authService = AuthService;
    }
  };
});

quickstart_users.directive('profile', function (AuthService) {
  return {
    templateUrl: 'partials/quickstart/profile-template.html',
    link: function link(scope, element, attr) {
      scope.authService = AuthService;
    }
  };
});

quickstart_users.directive('equals', function () {
  return {
    restrict: 'A', require: '?ngModel',
    link: function link(scope, elem, attrs, ngModel) {
      if (!ngModel) return;

      scope.$watch(attrs.ngModel, function () {
        validate();
      });

      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function validate() {
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
      };
    }
  };
});

quickstart_users.directive('changePassword', function (AuthService) {
  return {
    templateUrl: 'partials/quickstart/change-password-template.html',
    link: function link(scope, element, attr, ngModel) {
      scope.authService = AuthService;
    }
  };
});

quickstart_users.service('Flash', function () {
  this.error = function (message) {
    this.display(message, "error");
  };

  this.success = function (message) {
    this.display(message, "success");
  };

  this.display = function (message, alertClass) {
    $("#alert-flyover").html(message).removeClass("error, success");
    $("#alert-flyover").addClass("in").addClass(alertClass);
    setTimeout(function () {
      $("#alert-flyover").removeClass("in");
    }, 3500);
  };
});

quickstart_users.service('AuthService', function ($http, $rootScope, $route, AUTH_EVENTS, Flash) {
  this.ticket = function () {
    var cookie = BaseHelpers.getCookie("quickstart_session");

    if (cookie) {
      return JSON.parse(cookie).ticket;
    };

    return "";
  };

  this.currentUser = function () {
    var cookie = BaseHelpers.getCookie("quickstart_session");

    if (cookie) {
      cookie = JSON.parse(cookie);
      cookie["lastLoggedIn"] = BaseHelpers.dateTimeToString(cookie.lastLoggedIn, config.timezone);
      return cookie;
    };

    return "";
  };

  this.isLoggedIn = function () {
    return this.ticket() != "";
  };

  this.init = function () {
    var ticket = this.ticket();

    if (ticket) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $route.reload();
    } else {
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    };
  };

  this.login = function (user, onLoginAction) {
    $("#signIn").attr("disabled", "disabled").html("Signing in...");

    var currentUser = { username: user.email, password: user.password };
    _quickbaseClient2.default.quickstart.signIn(currentUser, function (response) {
      if (response.error) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

        Flash.error(response.error.message);
        $("#signIn").removeAttr("disabled").html("Sign In");
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      };
    });
  };

  this.logout = function () {
    _quickbaseClient2.default.quickstart.signOut(function (response) {
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    });
  };

  this.createUser = function (user) {
    $("#signUp").attr("disabled", "disabled").html("Processing...");

    var user = { username: user.email, password: user.password };
    _quickbaseClient2.default.quickstart.register(user, function (response) {
      if (response.error) {
        Flash.error(response.error.message);
        $("#signUp").removeAttr("disabled").html("Register");
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      };
    });
  };

  this.changePassword = function (user) {
    $("#changePassword").attr("disabled", "disabled").html("Processing...");

    var user = {
      newPassword: user.newPassword,
      currentPassword: user.oldPassword
    };

    _quickbaseClient2.default.quickstart.changePassword(user, function (response) {
      if (response.error) {
        Flash.error(response.error.message);
        $("#changePassword").removeAttr("disabled").html("Change Password");
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        Flash.success(response);
      }
    });
  };
});

},{"../../../app.json":1,"./quickbase-client":2}],4:[function(require,module,exports){
'use strict';

require('./js/modules/quickstart-users');

require('../tmp/templates');

var _quickbaseClient = require('./js/modules/quickbase-client');

var _quickbaseClient2 = _interopRequireDefault(_quickbaseClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainApp = angular.module("mainApp", ["quickstart-users"]);

mainApp.config(function ($routeProvider) {
  $routeProvider.when('/', { template: '<dashboard></dashboard>' });
});

mainApp.directive('dashboard', function (AuthService) {
  return {
    templateUrl: 'partials/app/dashboard-template.html',
    link: function link(scope, element, attr) {
      scope.authService = AuthService;
    }
  };
});

mainApp.controller('DashboardController', function ($scope) {
  _quickbaseClient2.default.activities.doQuery({ rid: { XEX: "" } }, {}, function (activities) {

    activities.forEach(function (activity, index) {
      var row = $("#activityTemplate").clone().removeAttr("id");

      console.log(activity);

      $(row).find(".number").html(index + 1);
      $(row).find(".customerName").html(activity.customerName);
      $(row).find(".type").html(activity.type);
      $(row).find(".date").html(BaseHelpers.dateToString(activity.date));

      $("#activities").append(row);
    });
  });
});

},{"../tmp/templates":5,"./js/modules/quickbase-client":2,"./js/modules/quickstart-users":3}],5:[function(require,module,exports){
"use strict";

angular.module("templates").run(["$templateCache", function ($templateCache) {
  $templateCache.put("partials/app/dashboard-template.html", "<div ng-controller=\"DashboardController\" class=\"container\">\n	<h5>Recent Activities</h5>\n	<hr>\n	<table class=\"table u-full-width\">\n		<thead>\n			<th></th>\n			<th>Customer Name</th>\n			<th>Type</th>\n			<th>Date</th>\n			<th></th>\n		</thead>\n		<tbody id=\"activities\">\n		</tbody>\n	</table>\n\n	<table id=\"templates\" class=\"table\" style=\"display:none\">\n		<tr id=\"activityTemplate\">\n			<td class=\"number\"></td>\n			<td class=\"customerName\"></td>\n			<td class=\"type\"></td>\n			<td class=\"date\"></td>\n			<td><button class=\"button button-primary\">View</button></td>\n		</tr>\n	</table>\n</div>");
  $templateCache.put("partials/quickstart/change-password-template.html", "<div class=\"user-container\">\n  <div class=\"twelve columns form-container center-text right\">\n    <form name=\"profileForm\" ng-submit=\"authService.changePassword(user)\" novalidate>\n      <h3>Change Password</h3>\n      <div class=\"row\">\n        <label for=\"currentPassword\">Current Password</label>\n        <input \n          id=\'oldPassword\' \n          name=\"oldPassword\"\n          class=\"u-full-width\" \n          type=\'password\' \n          ng-model=\"user.oldPassword\" \n          ng-minlength=\"6\"\n          ng-maxlength=\"12\"\n          required>\n      </div>\n\n      <div class=\"row\">\n        <label for=\"newPassword\">New Password</label>\n        <input \n          id=\"newPassword\"\n          name=\"newPassword\"\n          class=\"u-full-width\" \n          ng-model=\"user.newPassword\" \n          type=\'password\'\n          ng-minlength=\"6\"\n          ng-maxlength=\"12\"\n          equals=\"{{user.confirmPassword}}\"\n          required\n          >\n      </div>\n      <div class=\"row\">\n        <label for=\"confirmPassword\">Confirm Password</label>\n        <input \n          id=\"confirmPassword\"\n          name=\"confirmPassword\"\n          class=\"u-full-width\" \n          ng-model=\"user.confirmPassword\" \n          type=\'password\' \n          ng-minlength=\"6\"\n          ng-maxlength=\"12\"\n          equals=\"{{user.newPassword}}\"\n          required\n          >\n      </div>\n      \n      <a href=\"#/\" class=\"button\">Cancel</a>\n      <button id=\"changePassword\" class=\"button-primary form-button\" ng-disabled=\"profileForm.$invalid\">\n        Change Password\n      </button>\n    </form>\n  </div>\n</div>\n\n<div class=\"validation-errors\" ng-show=\"profileForm.$invalid\">\n  <label class=\"user-error\" ng-show=\"profileForm.oldPassword.$error.required\">\n    Current Password Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"profileForm.newPassword.$error.required\">\n    New Password Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"profileForm.confirmPassword.$error.required\">\n    Confirm Password Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"profileForm.newPassword.$error.equals\">\n    Passwords do not match.\n  </label>\n  <label class=\"user-error\" \n    ng-show=\"\n      profileForm.oldPassword.$error.minlength || \n      profileForm.newPassword.$error.minlength || \n      profileForm.confirmPassword.$error.minlength || \n      profileForm.oldPassword.$error.maxlength || \n      profileForm.newPassword.$error.maxlength || \n      profileForm.confirmPassword.$error.maxlength\"\n    >\n    Passwords must be at between 6-12 characters.\n  </label>\n</div>\n");
  $templateCache.put("partials/quickstart/forgot-password-template.html", "<div class=\"user-container\">\n  <div class=\"twelve columns form-container center-text\">\n    <h5>To reset password, please contact \"example@gmail.com\".</h5>\n    <a class=\"button grey\" ng-href=\"#/login\">Cancel</a>\n  </div>\n</div>\n");
  $templateCache.put("partials/quickstart/login-form-template.html", "<div class=\"user-container\">\n  <div class=\"twelve columns center-text\">\n    <form name=\"loginForm\" ng-submit=\"authService.login(user)\" novalidate>\n      <div class=\"row\">    \n        <h3>Sign In</h3>\n        <div class=\"row\">\n          <label>Email</label>\n          <input \n            id=\"email\" \n            name=\"email\"\n            class=\"u-full-width ng-invalid\" \n            type=\"text\"  \n            ng-model=\"user.email\"\n            ng-pattern=\"/^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$/\"\n            required\n            />\n        </div>\n        \n        <div class=\"row\">      \n          <div class=\"u-full-width\">  \n            <label>Password</label>\n            <input \n              id=\"password\" \n              name=\"password\"\n              class=\"u-full-width\" \n              type=\"password\" \n              ng-model=\"user.password\"\n              ng-minlength=\"6\"\n              ng-maxlength=\"12\"\n              required/>\n          </div>\n        </div>\n\n        <button id=\"signIn\" class=\"button-primary form-button\" type=\"submit\" ng-disabled=\"loginForm.$invalid\">Sign In</button>\n        <div class=\"row\">\n          <a \n            id=\"register\" \n            class=\"user-managment-link\" \n            ng-href=\"#register\">Register</a>\n          <a \n            id=\"forgot-password\" \n            class=\"user-managment-link\" \n            ng-href=\"#forgotPassword\">Forgot Password?</a>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>\n\n<div class=\"validation-errors\" ng-show=\"loginForm.$invalid\">\n  <label class=\"user-error\" ng-show=\"loginForm.email.$error.required\">\n    Email Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"loginForm.email.$error.pattern\">\n    Email must be valid email format.\n  </label>\n  <label class=\"user-error\" ng-show=\"loginForm.password.$error.required\">\n    Password Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"loginForm.password.$error.minlength || loginForm.password.$error.maxlength\">\n    Passwords must be at between 6-12 characters.\n  </label>\n</div>");
  $templateCache.put("partials/quickstart/profile-template.html", "<div class=\"container\">\n  <h3>Profile</h3>\n  <hr>\n\n  <form>\n    <label>Name:</label>\n    <h4>{{currentUser.name}}</h4>\n    <label>Last Logged In:</label>\n    <h4>{{currentUser.lastLoggedIn}}</h4>\n\n    <hr>\n    <a id=\"changePassword\" href=\"/#changePassword\" class=\"button\">Change Password</a>\n  </form>\n</div>\n");
  $templateCache.put("partials/quickstart/register-user-template.html", "<div class=\"user-container\">\n  <div class=\"twelve columns form-container center-text right\">\n    <form name=\"registerForm\" ng-submit=\"authService.createUser(user)\" novalidate>\n      <h3>Register</h3>\n      <div class=\"row\">\n        <label>Email</label>\n        <input \n          id=\'email\' \n          name=\'email\'\n          class=\"u-full-width\" \n          type=\'email\' \n          ng-model=\"user.email\" \n          ng-pattern=\"/^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$/\"\n          required>\n      </div>\n      <div class=\"row\">\n        <label>Password</label>\n        <input \n          id=\'password\' \n          name=\"password\"\n          class=\"u-full-width\" \n          type=\'password\' \n          ng-model=\"user.password\" \n          ng-minlength=\"6\"\n          ng-maxlength=\"12\"\n          equals=\"{{user.confirmPassword}}\"\n          required>\n      </div>\n      <div class=\"row\">\n        <label for=\"confirmPassword\">Confirm Password</label>\n        <input \n          id=\"confirmPassword\"\n          name=\"confirmPassword\"\n          class=\"u-full-width\" \n          ng-model=\"user.confirmPassword\" \n          type=\'password\' \n          ng-minlength=\"6\"\n          ng-maxlength=\"12\"\n          equals=\"{{user.password}}\"\n          required\n          >\n      </div>\n      <a class=\"button\" ng-href=\"#/login\">Cancel</a>\n      <button id=\"signUp\" class=\"button-primary form-button\" type=\"submit\" ng-disabled=\"registerForm.$invalid\">Register</button>\n    </form>\n  </div>\n</div>\n\n<div class=\"validation-errors\" ng-show=\"registerForm.$invalid\">\n  <label class=\"user-error\" ng-show=\"registerForm.email.$error.required\">\n    Email Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"registerForm.email.$error.pattern\">\n    Email must be valid email format.\n  </label>\n  <label class=\"user-error\" ng-show=\"registerForm.password.$error.required\">\n    Password Required.\n  </label>\n  <label class=\"user-error\" ng-show=\"registerForm.confirmPassword.$error.required\">\n    Confirm Password Required.\n  </label>\n  <label class=\"user-error\" \n    ng-show=\"\n      registerForm.password.$error.minlength || \n      registerForm.password.$error.maxlength || \n      registerForm.confirmPassword.$error.minlength || \n      registerForm.confirmPassword.$error.maxlength\"\n    >\n    Passwords must be at between 6-12 characters.\n  </label>\n  <label class=\"user-error\" ng-show=\"registerForm.password.$error.equals\">\n    Passwords do not match.\n  </label>\n</div>");
}]);

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAuanNvbiIsInNyYy9qcy9tb2R1bGVzL3F1aWNrYmFzZS1jbGllbnQuanMiLCJzcmMvanMvbW9kdWxlcy9xdWlja3N0YXJ0LXVzZXJzLmpzIiwic3JjL21haW4uanMiLCJ0bXAvdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDekNBLElBQUksU0FBUyxRQUFRLG1CQUFSLEVBQTZCLFlBQTdCLENBQWI7O0FBRUEsSUFBTSxLQUFLLElBQUksSUFBSixDQUFTLE1BQVQsQ0FBWDtrQkFDZSxFOzs7OztBQ0ZmOzs7Ozs7QUFEQSxJQUFJLFNBQVMsUUFBUSxtQkFBUixDQUFiOzs7QUFHQSxRQUFRLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLEVBQTVCO0FBQ0EsSUFBSSxtQkFBbUIsUUFBUSxNQUFSLENBQWUsa0JBQWYsRUFBbUMsQ0FBQyxTQUFELEVBQVksV0FBWixDQUFuQyxDQUF2Qjs7QUFFQSxpQkFBaUIsUUFBakIsQ0FBMEIsYUFBMUIsRUFBeUM7QUFDdkMsZ0JBQWMsb0JBRHlCO0FBRXZDLGVBQWEsbUJBRjBCO0FBR3ZDLGlCQUFlLHFCQUh3QjtBQUl2QyxvQkFBa0I7QUFKcUIsQ0FBekM7O0FBT0EsaUJBQWlCLEdBQWpCLENBQXFCLENBQUMsYUFBRCxFQUFnQixVQUFVLFdBQVYsRUFBdUI7QUFDMUQsY0FBWSxJQUFaO0FBQ0QsQ0FGb0IsQ0FBckI7OztBQUtBLGlCQUFp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LElBQW5DO0FBQ0EsUUFBRSxHQUFGLEVBQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsSUFBckIsQ0FBMEIsWUFBWSxZQUFaLENBQXlCLFNBQVMsSUFBbEMsQ0FBMUI7O0FBRUEsUUFBRSxhQUFGLEVBQWlCLE1BQWpCLENBQXdCLEdBQXhCO0FBQ0QsS0FYRDtBQVlGLEdBZEQ7QUFlQSxDQWhCRDs7Ozs7QUNwQkEsUUFBUSxNQUFSLENBQWUsV0FBZixFQUE0QixHQUE1QixDQUFnQyxDQUFDLGdCQUFELEVBQW1CLFVBQVMsY0FBVCxFQUF5QjtBQUFDLGlCQUFlLEdBQWYsQ0FBbUIsc0NBQW5CLEVBQTBELG1uQkFBMUQ7QUFDN0UsaUJBQWUsR0FBZixDQUFtQixtREFBbkIsRUFBdUUsMHFGQUF2RTtBQUNBLGlCQUFlLEdBQWYsQ0FBbUIsbURBQW5CLEVBQXVFLHFQQUF2RTtBQUNBLGlCQUFlLEdBQWYsQ0FBbUIsOENBQW5CLEVBQWtFLDRwRUFBbEU7QUFDQSxpQkFBZSxHQUFmLENBQW1CLDJDQUFuQixFQUErRCw2VUFBL0Q7QUFDQSxpQkFBZSxHQUFmLENBQW1CLGlEQUFuQixFQUFxRSw2a0ZBQXJFO0FBQXFwRixDQUxybkYsQ0FBaEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJBSVNRdWlja1N0YXJ0Q1JNXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJRdWlja1N0YXJ0IGRlbW8gYXBwbGljYXRpb24uXCIsXG4gIFwiY2xpZW50XCI6IFwiQUlTXCIsXG4gIFwidXNlcm5hbWVcIjogXCJraXRoXCIsXG4gIFwib3JpZ2luXCI6IFwiXCIsXG4gIFwiYXV0aG9yc1wiOiBbXCJraGVuc2VsQGFkdmFudGFnZXF1aWNrYmFzZS5jb21cIiwgXCJ6c2lnbGluQGFkdmFudGFnZXF1aWNrYmFzZS5jb21cIl0sXG4gIFwiYm9vdHN0cmFwXCI6IFwiLi9zcmMvbWFpbi5qc1wiLFxuICBcInRpbWV6b25lXCI6IFwiZWFzdGVyblwiLFxuICBcImJhc2VDb25maWdcIjoge1xuICAgIFwicXVpY2tzdGFydFwiOiBcInRydWVcIixcbiAgICBcInJlYWxtXCI6IFwiYWlzXCIsXG4gICAgXCJ0b2tlblwiOiBcIlwiLFxuICAgIFwiYXN5bmNcIjogXCJjYWxsYmFja1wiLFxuICAgIFwiZGF0YWJhc2VJZFwiOiBcImJrcWRoeWNkeVwiLFxuICAgIFwidGFibGVzXCI6IHtcbiAgICAgIFwiY3VzdG9tZXJzXCI6IHtcbiAgICAgICAgXCJkYmlkXCI6IFwiYmtxZGh5Y2VnXCIsXG4gICAgICAgIFwicmlkXCI6IFwiM1wiLFxuICAgICAgICBcInF1aWNrc3RhcnRcIjoge1xuICAgICAgICAgIFwidXNlcm5hbWVcIjogXCIyMVwiLFxuICAgICAgICAgIFwicGFzc3dvcmRcIjogXCIzOFwiLFxuICAgICAgICAgIFwia2V5XCI6IFwiMzlcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCI0MlwiLFxuICAgICAgICAgIFwibGFzdExvZ2dlZEluXCI6IFwiNDBcIixcbiAgICAgICAgICBcInJlc3RyaWN0ZWRcIjogXCI0NlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImFjdGl2aXRpZXNcIjoge1xuICAgICAgICBcImRiaWRcIjogXCJia3FkaHljZWtcIixcbiAgICAgICAgXCJyaWRcIjogXCIzXCIsXG4gICAgICAgIFwidHlwZVwiOiBcIjdcIixcbiAgICAgICAgXCJjdXN0b21lck5hbWVcIjogXCI4XCIsXG4gICAgICAgIFwiZGF0ZVwiOiBcIjZcIixcbiAgICAgICAgXCJxdWlja3N0YXJ0XCI6IHtcbiAgICAgICAgICBcInZpZXdLZXlcIjogXCIzNFwiLFxuICAgICAgICAgIFwibW9kaWZ5S2V5XCI6IFwiMzVcIlxuICAgICAgICB9XG4gICAgICB9ICAgICAgXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uLy4uLy4uL2FwcC5qc29uJylbXCJiYXNlQ29uZmlnXCJdO1xuXG5jb25zdCBkYiA9IG5ldyBCYXNlKGNvbmZpZyk7XG5leHBvcnQgZGVmYXVsdCBkYjsiLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vLi4vLi4vYXBwLmpzb24nKTtcbmltcG9ydCBCYXNlIGZyb20gXCIuL3F1aWNrYmFzZS1jbGllbnRcIlxuXG5hbmd1bGFyLm1vZHVsZSgndGVtcGxhdGVzJywgW10pXG52YXIgcXVpY2tzdGFydF91c2VycyA9IGFuZ3VsYXIubW9kdWxlKFwicXVpY2tzdGFydC11c2Vyc1wiLCBbJ25nUm91dGUnLCAndGVtcGxhdGVzJ10pO1xuICBcbnF1aWNrc3RhcnRfdXNlcnMuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCdcbn0pXG5cbnF1aWNrc3RhcnRfdXNlcnMucnVuKFsnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoQXV0aFNlcnZpY2UpIHtcbiAgQXV0aFNlcnZpY2UuaW5pdCgpO1xufV0pXG5cbi8vIENoZWNrIEF1dGggb24gTmF2XG5xdWlja3N0YXJ0X3VzZXJzLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsIEF1dGhTZXJ2aWNlLCAkbG9jYXRpb24pIHtcbiAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0KSB7XG4gICAgXG4gICAgY29uc29sZS5sb2coXCJUT0RPLi4uVEhJUyBTSE9VTEQgT05MWSBMT0FEIE9OQ0UuXCIpO1xuXG4gICAgaWYoIW5leHQucHVibGljKXtcbiAgICAgIGlmKCFBdXRoU2VydmljZS5pc0xvZ2dlZEluKCkpe1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sb2dpblwiKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfSk7XG59KVxuXG5xdWlja3N0YXJ0X3VzZXJzLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICRyb3V0ZVByb3ZpZGVyXG4gIC53aGVuKCcvbG9naW4nLCB7IHRlbXBsYXRlOiAnPGxvZ2luLWRpYWxvZz48L2xvZ2luLWRpYWxvZz4nLCBwdWJsaWM6IHRydWUgfSlcbiAgLndoZW4oJy9yZWdpc3RlcicsIHsgdGVtcGxhdGU6ICc8cmVnaXN0ZXItdXNlcj48L3JlZ2lzdGVyLXVzZXI+JywgcHVibGljOiB0cnVlIH0pXG4gIC53aGVuKCcvZm9yZ290UGFzc3dvcmQnLCB7IHRlbXBsYXRlOiAnPGZvcmdvdC1wYXNzd29yZD48L2ZvcmdvdC1wYXNzd29yZD4nLCBwdWJsaWM6IHRydWUgfSlcbiAgLndoZW4oJy9jaGFuZ2VQYXNzd29yZCcsIHsgdGVtcGxhdGU6ICc8Y2hhbmdlLXBhc3N3b3JkPjwvY2hhbmdlLXBhc3N3b3JkPicgfSlcbiAgLndoZW4oJy9wcm9maWxlJywgeyB0ZW1wbGF0ZTogJzxwcm9maWxlPjwvcHJvZmlsZT4nIH0pXG4gIC5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnL2xvZ2luJyB9KTtcbn0pXG5cbnF1aWNrc3RhcnRfdXNlcnMuY29udHJvbGxlcignQXBwbGljYXRpb25Db250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvdXRlLCAkbG9jYXRpb24sIEFVVEhfRVZFTlRTLCBBdXRoU2VydmljZSkge1xuICAkc2NvcGUuaXNMb2dnZWRJbiA9IEF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKTtcblxuICAkc2NvcGUubG9nb3V0ID0gQXV0aFNlcnZpY2UubG9nb3V0O1xuXG4gICRzY29wZS5jdXJyZW50VXNlciA9IEF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VyKCk7XG4gICRzY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBmdW5jdGlvbigpe1xuICAgICRzY29wZS5jdXJyZW50VXNlciA9IEF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VyKCk7XG4gICAgJHNjb3BlLmlzTG9nZ2VkSW4gPSB0cnVlO1xuICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAkc2NvcGUuJGFwcGx5KCk7XG4gIH0pO1xuXG4gICRzY29wZS4kb24oQVVUSF9FVkVOVFMubG9nb3V0U3VjY2VzcywgZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuICAgICRzY29wZS5pc0xvZ2dlZEluID0gZmFsc2U7XG4gICAgJGxvY2F0aW9uLnBhdGgoXCIvbG9naW5cIik7XG4gICAgJHNjb3BlLiRhcHBseSgpO1xuICB9KTtcbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBMb2dpbiBEaWFsb2cgRGlyZWN0aXZlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucXVpY2tzdGFydF91c2Vycy5kaXJlY3RpdmUoJ2xvZ2luRGlhbG9nJywgZnVuY3Rpb24gKEFVVEhfRVZFTlRTLCBBdXRoU2VydmljZSkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcXVpY2tzdGFydC9sb2dpbi1mb3JtLXRlbXBsYXRlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgc2NvcGUuYXV0aFNlcnZpY2UgPSBBdXRoU2VydmljZTtcbiAgICB9XG4gIH07XG59KVxuXG5xdWlja3N0YXJ0X3VzZXJzLmRpcmVjdGl2ZSgncmVnaXN0ZXJVc2VyJywgZnVuY3Rpb24gKEF1dGhTZXJ2aWNlKSB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9xdWlja3N0YXJ0L3JlZ2lzdGVyLXVzZXItdGVtcGxhdGUuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG4gICAgICBzY29wZS5hdXRoU2VydmljZSA9IEF1dGhTZXJ2aWNlOyBcbiAgICB9XG4gIH07XG59KVxuXG5xdWlja3N0YXJ0X3VzZXJzLmRpcmVjdGl2ZSgnZm9yZ290UGFzc3dvcmQnLCBmdW5jdGlvbiAoQXV0aFNlcnZpY2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3F1aWNrc3RhcnQvZm9yZ290LXBhc3N3b3JkLXRlbXBsYXRlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgc2NvcGUuYXV0aFNlcnZpY2UgPSBBdXRoU2VydmljZTsgXG4gICAgfVxuICB9O1xufSlcblxucXVpY2tzdGFydF91c2Vycy5kaXJlY3RpdmUoJ3Byb2ZpbGUnLCBmdW5jdGlvbiAoQXV0aFNlcnZpY2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3F1aWNrc3RhcnQvcHJvZmlsZS10ZW1wbGF0ZS5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcbiAgICAgIHNjb3BlLmF1dGhTZXJ2aWNlID0gQXV0aFNlcnZpY2U7IFxuICAgIH1cbiAgfTtcbn0pXG5cbnF1aWNrc3RhcnRfdXNlcnMuZGlyZWN0aXZlKCdlcXVhbHMnLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLCByZXF1aXJlOiAnP25nTW9kZWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgaWYoIW5nTW9kZWwpIHJldHVybjtcbiAgICAgIFxuICAgICAgc2NvcGUuJHdhdGNoKGF0dHJzLm5nTW9kZWwsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YWxpZGF0ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGF0dHJzLiRvYnNlcnZlKCdlcXVhbHMnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIHZhbGlkYXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWwxID0gbmdNb2RlbC4kdmlld1ZhbHVlO1xuICAgICAgICB2YXIgdmFsMiA9IGF0dHJzLmVxdWFscztcbiAgICAgICAgbmdNb2RlbC4kc2V0VmFsaWRpdHkoJ2VxdWFscycsICEgdmFsMSB8fCAhIHZhbDIgfHwgdmFsMSA9PT0gdmFsMik7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufSk7XG5cbnF1aWNrc3RhcnRfdXNlcnMuZGlyZWN0aXZlKCdjaGFuZ2VQYXNzd29yZCcsIGZ1bmN0aW9uIChBdXRoU2VydmljZSkge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcXVpY2tzdGFydC9jaGFuZ2UtcGFzc3dvcmQtdGVtcGxhdGUuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBuZ01vZGVsKSB7XG4gICAgICBzY29wZS5hdXRoU2VydmljZSA9IEF1dGhTZXJ2aWNlOyBcbiAgICB9XG4gIH07XG59KVxuXG5xdWlja3N0YXJ0X3VzZXJzLnNlcnZpY2UoJ0ZsYXNoJywgZnVuY3Rpb24oKXtcbiAgdGhpcy5lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgIHRoaXMuZGlzcGxheShtZXNzYWdlLCBcImVycm9yXCIpO1xuICB9O1xuXG4gIHRoaXMuc3VjY2VzcyA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgIHRoaXMuZGlzcGxheShtZXNzYWdlLCBcInN1Y2Nlc3NcIik7XG4gIH07XG5cbiAgdGhpcy5kaXNwbGF5ID0gZnVuY3Rpb24obWVzc2FnZSwgYWxlcnRDbGFzcyl7XG4gICAgJChcIiNhbGVydC1mbHlvdmVyXCIpLmh0bWwobWVzc2FnZSkucmVtb3ZlQ2xhc3MoXCJlcnJvciwgc3VjY2Vzc1wiKTtcbiAgICAkKFwiI2FsZXJ0LWZseW92ZXJcIikuYWRkQ2xhc3MoXCJpblwiKS5hZGRDbGFzcyhhbGVydENsYXNzKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAkKFwiI2FsZXJ0LWZseW92ZXJcIikucmVtb3ZlQ2xhc3MoXCJpblwiKTtcbiAgICB9LCAzNTAwKTtcbiAgfVxufSk7XG5cbnF1aWNrc3RhcnRfdXNlcnMuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICRyb290U2NvcGUsICRyb3V0ZSwgQVVUSF9FVkVOVFMsIEZsYXNoKSB7XG4gIHRoaXMudGlja2V0ID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgY29va2llID0gQmFzZUhlbHBlcnMuZ2V0Q29va2llKFwicXVpY2tzdGFydF9zZXNzaW9uXCIpO1xuXG4gICAgaWYoY29va2llKXtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNvb2tpZSkudGlja2V0O1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIFwiXCI7XG4gIH07XG5cbiAgdGhpcy5jdXJyZW50VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGNvb2tpZSA9IEJhc2VIZWxwZXJzLmdldENvb2tpZShcInF1aWNrc3RhcnRfc2Vzc2lvblwiKTtcblxuICAgIGlmKGNvb2tpZSl7XG4gICAgICBjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG4gICAgICBjb29raWVbXCJsYXN0TG9nZ2VkSW5cIl0gPSBCYXNlSGVscGVycy5kYXRlVGltZVRvU3RyaW5nKGNvb2tpZS5sYXN0TG9nZ2VkSW4sIGNvbmZpZy50aW1lem9uZSk7XG4gICAgICByZXR1cm4gY29va2llO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIFwiXCI7XG4gIH07XG5cbiAgdGhpcy5pc0xvZ2dlZEluID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy50aWNrZXQoKSAhPSBcIlwiO1xuICB9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRpY2tldCA9IHRoaXMudGlja2V0KCk7XG5cbiAgICBpZih0aWNrZXQpe1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAkcm91dGUucmVsb2FkKCk7XG4gICAgfWVsc2V7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCk7XG4gICAgfTtcbiAgfTtcblxuICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKHVzZXIsIG9uTG9naW5BY3Rpb24pe1xuICAgICQoXCIjc2lnbkluXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpLmh0bWwoXCJTaWduaW5nIGluLi4uXCIpO1xuXG4gICAgdmFyIGN1cnJlbnRVc2VyID0geyB1c2VybmFtZTogdXNlci5lbWFpbCwgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQgfTtcbiAgICBCYXNlLnF1aWNrc3RhcnQuc2lnbkluKGN1cnJlbnRVc2VyLCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcil7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpbkZhaWxlZCk7XG5cbiAgICAgICAgRmxhc2guZXJyb3IocmVzcG9uc2UuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICQoXCIjc2lnbkluXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKS5odG1sKFwiU2lnbiBJblwiKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgQmFzZS5xdWlja3N0YXJ0LnNpZ25PdXQoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuY3JlYXRlVXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICQoXCIjc2lnblVwXCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpLmh0bWwoXCJQcm9jZXNzaW5nLi4uXCIpO1xuXG4gICAgdmFyIHVzZXIgPSB7IHVzZXJuYW1lOiB1c2VyLmVtYWlsLCBwYXNzd29yZDogdXNlci5wYXNzd29yZCB9O1xuICAgIEJhc2UucXVpY2tzdGFydC5yZWdpc3Rlcih1c2VyLCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBpZihyZXNwb25zZS5lcnJvcil7XG4gICAgICAgIEZsYXNoLmVycm9yKHJlc3BvbnNlLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAkKFwiI3NpZ25VcFwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIikuaHRtbChcIlJlZ2lzdGVyXCIpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChBVVRIX0VWRU5UUy5sb2dpblN1Y2Nlc3MpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmNoYW5nZVBhc3N3b3JkID0gZnVuY3Rpb24odXNlcil7XG4gICAgJChcIiNjaGFuZ2VQYXNzd29yZFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgXCJkaXNhYmxlZFwiKS5odG1sKFwiUHJvY2Vzc2luZy4uLlwiKTtcbiAgICBcbiAgICB2YXIgdXNlciA9IHtcbiAgICAgIG5ld1Bhc3N3b3JkOiB1c2VyLm5ld1Bhc3N3b3JkLFxuICAgICAgY3VycmVudFBhc3N3b3JkOiB1c2VyLm9sZFBhc3N3b3JkIFxuICAgIH07XG5cbiAgICBCYXNlLnF1aWNrc3RhcnQuY2hhbmdlUGFzc3dvcmQodXNlciwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgaWYocmVzcG9uc2UuZXJyb3Ipe1xuICAgICAgICBGbGFzaC5lcnJvcihyZXNwb25zZS5lcnJvci5tZXNzYWdlKTtcbiAgICAgICAgJChcIiNjaGFuZ2VQYXNzd29yZFwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIikuaHRtbChcIkNoYW5nZSBQYXNzd29yZFwiKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgRmxhc2guc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KSIsImltcG9ydCAnLi9qcy9tb2R1bGVzL3F1aWNrc3RhcnQtdXNlcnMnO1xuaW1wb3J0ICcuLi90bXAvdGVtcGxhdGVzJztcbmltcG9ydCBCYXNlIGZyb20gXCIuL2pzL21vZHVsZXMvcXVpY2tiYXNlLWNsaWVudFwiXG5cbnZhciBtYWluQXBwID0gYW5ndWxhci5tb2R1bGUoXCJtYWluQXBwXCIsIFtcInF1aWNrc3RhcnQtdXNlcnNcIl0pXG5cbm1haW5BcHAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuICAkcm91dGVQcm92aWRlclxuICAgIC53aGVuKCcvJywgeyB0ZW1wbGF0ZTogJzxkYXNoYm9hcmQ+PC9kYXNoYm9hcmQ+JyB9KVxufSk7XG5cbm1haW5BcHAuZGlyZWN0aXZlKCdkYXNoYm9hcmQnLCBmdW5jdGlvbiAoQXV0aFNlcnZpY2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2FwcC9kYXNoYm9hcmQtdGVtcGxhdGUuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyKXtcbiAgICAgIHNjb3BlLmF1dGhTZXJ2aWNlID0gQXV0aFNlcnZpY2U7XG4gICAgfVxuICB9O1xufSlcblxubWFpbkFwcC5jb250cm9sbGVyKCdEYXNoYm9hcmRDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKXtcblx0QmFzZS5hY3Rpdml0aWVzLmRvUXVlcnkoeyByaWQ6IHsgWEVYOiBcIlwiIH19LCB7fSwgZnVuY3Rpb24oYWN0aXZpdGllcyl7XG5cbiAgICBhY3Rpdml0aWVzLmZvckVhY2goZnVuY3Rpb24oYWN0aXZpdHksIGluZGV4KXtcbiAgICAgIHZhciByb3cgPSAkKFwiI2FjdGl2aXR5VGVtcGxhdGVcIikuY2xvbmUoKS5yZW1vdmVBdHRyKFwiaWRcIik7XG5cbiAgICAgIGNvbnNvbGUubG9nKGFjdGl2aXR5KVxuXG4gICAgICAkKHJvdykuZmluZChcIi5udW1iZXJcIikuaHRtbChpbmRleCArIDEpO1xuICAgICAgJChyb3cpLmZpbmQoXCIuY3VzdG9tZXJOYW1lXCIpLmh0bWwoYWN0aXZpdHkuY3VzdG9tZXJOYW1lKTtcbiAgICAgICQocm93KS5maW5kKFwiLnR5cGVcIikuaHRtbChhY3Rpdml0eS50eXBlKTtcbiAgICAgICQocm93KS5maW5kKFwiLmRhdGVcIikuaHRtbChCYXNlSGVscGVycy5kYXRlVG9TdHJpbmcoYWN0aXZpdHkuZGF0ZSkpO1xuXG4gICAgICAkKFwiI2FjdGl2aXRpZXNcIikuYXBwZW5kKHJvdyk7XG4gICAgfSk7XG5cdH0pO1xufSkiLCJhbmd1bGFyLm1vZHVsZShcInRlbXBsYXRlc1wiKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHskdGVtcGxhdGVDYWNoZS5wdXQoXCJwYXJ0aWFscy9hcHAvZGFzaGJvYXJkLXRlbXBsYXRlLmh0bWxcIixcIjxkaXYgbmctY29udHJvbGxlcj1cXFwiRGFzaGJvYXJkQ29udHJvbGxlclxcXCIgY2xhc3M9XFxcImNvbnRhaW5lclxcXCI+XFxuXHQ8aDU+UmVjZW50IEFjdGl2aXRpZXM8L2g1Plxcblx0PGhyPlxcblx0PHRhYmxlIGNsYXNzPVxcXCJ0YWJsZSB1LWZ1bGwtd2lkdGhcXFwiPlxcblx0XHQ8dGhlYWQ+XFxuXHRcdFx0PHRoPjwvdGg+XFxuXHRcdFx0PHRoPkN1c3RvbWVyIE5hbWU8L3RoPlxcblx0XHRcdDx0aD5UeXBlPC90aD5cXG5cdFx0XHQ8dGg+RGF0ZTwvdGg+XFxuXHRcdFx0PHRoPjwvdGg+XFxuXHRcdDwvdGhlYWQ+XFxuXHRcdDx0Ym9keSBpZD1cXFwiYWN0aXZpdGllc1xcXCI+XFxuXHRcdDwvdGJvZHk+XFxuXHQ8L3RhYmxlPlxcblxcblx0PHRhYmxlIGlkPVxcXCJ0ZW1wbGF0ZXNcXFwiIGNsYXNzPVxcXCJ0YWJsZVxcXCIgc3R5bGU9XFxcImRpc3BsYXk6bm9uZVxcXCI+XFxuXHRcdDx0ciBpZD1cXFwiYWN0aXZpdHlUZW1wbGF0ZVxcXCI+XFxuXHRcdFx0PHRkIGNsYXNzPVxcXCJudW1iZXJcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkIGNsYXNzPVxcXCJjdXN0b21lck5hbWVcXFwiPjwvdGQ+XFxuXHRcdFx0PHRkIGNsYXNzPVxcXCJ0eXBlXFxcIj48L3RkPlxcblx0XHRcdDx0ZCBjbGFzcz1cXFwiZGF0ZVxcXCI+PC90ZD5cXG5cdFx0XHQ8dGQ+PGJ1dHRvbiBjbGFzcz1cXFwiYnV0dG9uIGJ1dHRvbi1wcmltYXJ5XFxcIj5WaWV3PC9idXR0b24+PC90ZD5cXG5cdFx0PC90cj5cXG5cdDwvdGFibGU+XFxuPC9kaXY+XCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwicGFydGlhbHMvcXVpY2tzdGFydC9jaGFuZ2UtcGFzc3dvcmQtdGVtcGxhdGUuaHRtbFwiLFwiPGRpdiBjbGFzcz1cXFwidXNlci1jb250YWluZXJcXFwiPlxcbiAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgZm9ybS1jb250YWluZXIgY2VudGVyLXRleHQgcmlnaHRcXFwiPlxcbiAgICA8Zm9ybSBuYW1lPVxcXCJwcm9maWxlRm9ybVxcXCIgbmctc3VibWl0PVxcXCJhdXRoU2VydmljZS5jaGFuZ2VQYXNzd29yZCh1c2VyKVxcXCIgbm92YWxpZGF0ZT5cXG4gICAgICA8aDM+Q2hhbmdlIFBhc3N3b3JkPC9oMz5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGxhYmVsIGZvcj1cXFwiY3VycmVudFBhc3N3b3JkXFxcIj5DdXJyZW50IFBhc3N3b3JkPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgaWQ9XFwnb2xkUGFzc3dvcmRcXCcgXFxuICAgICAgICAgIG5hbWU9XFxcIm9sZFBhc3N3b3JkXFxcIlxcbiAgICAgICAgICBjbGFzcz1cXFwidS1mdWxsLXdpZHRoXFxcIiBcXG4gICAgICAgICAgdHlwZT1cXCdwYXNzd29yZFxcJyBcXG4gICAgICAgICAgbmctbW9kZWw9XFxcInVzZXIub2xkUGFzc3dvcmRcXFwiIFxcbiAgICAgICAgICBuZy1taW5sZW5ndGg9XFxcIjZcXFwiXFxuICAgICAgICAgIG5nLW1heGxlbmd0aD1cXFwiMTJcXFwiXFxuICAgICAgICAgIHJlcXVpcmVkPlxcbiAgICAgIDwvZGl2PlxcblxcbiAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICA8bGFiZWwgZm9yPVxcXCJuZXdQYXNzd29yZFxcXCI+TmV3IFBhc3N3b3JkPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgaWQ9XFxcIm5ld1Bhc3N3b3JkXFxcIlxcbiAgICAgICAgICBuYW1lPVxcXCJuZXdQYXNzd29yZFxcXCJcXG4gICAgICAgICAgY2xhc3M9XFxcInUtZnVsbC13aWR0aFxcXCIgXFxuICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VyLm5ld1Bhc3N3b3JkXFxcIiBcXG4gICAgICAgICAgdHlwZT1cXCdwYXNzd29yZFxcJ1xcbiAgICAgICAgICBuZy1taW5sZW5ndGg9XFxcIjZcXFwiXFxuICAgICAgICAgIG5nLW1heGxlbmd0aD1cXFwiMTJcXFwiXFxuICAgICAgICAgIGVxdWFscz1cXFwie3t1c2VyLmNvbmZpcm1QYXNzd29yZH19XFxcIlxcbiAgICAgICAgICByZXF1aXJlZFxcbiAgICAgICAgICA+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgIDxsYWJlbCBmb3I9XFxcImNvbmZpcm1QYXNzd29yZFxcXCI+Q29uZmlybSBQYXNzd29yZDwvbGFiZWw+XFxuICAgICAgICA8aW5wdXQgXFxuICAgICAgICAgIGlkPVxcXCJjb25maXJtUGFzc3dvcmRcXFwiXFxuICAgICAgICAgIG5hbWU9XFxcImNvbmZpcm1QYXNzd29yZFxcXCJcXG4gICAgICAgICAgY2xhc3M9XFxcInUtZnVsbC13aWR0aFxcXCIgXFxuICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VyLmNvbmZpcm1QYXNzd29yZFxcXCIgXFxuICAgICAgICAgIHR5cGU9XFwncGFzc3dvcmRcXCcgXFxuICAgICAgICAgIG5nLW1pbmxlbmd0aD1cXFwiNlxcXCJcXG4gICAgICAgICAgbmctbWF4bGVuZ3RoPVxcXCIxMlxcXCJcXG4gICAgICAgICAgZXF1YWxzPVxcXCJ7e3VzZXIubmV3UGFzc3dvcmR9fVxcXCJcXG4gICAgICAgICAgcmVxdWlyZWRcXG4gICAgICAgICAgPlxcbiAgICAgIDwvZGl2PlxcbiAgICAgIFxcbiAgICAgIDxhIGhyZWY9XFxcIiMvXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIj5DYW5jZWw8L2E+XFxuICAgICAgPGJ1dHRvbiBpZD1cXFwiY2hhbmdlUGFzc3dvcmRcXFwiIGNsYXNzPVxcXCJidXR0b24tcHJpbWFyeSBmb3JtLWJ1dHRvblxcXCIgbmctZGlzYWJsZWQ9XFxcInByb2ZpbGVGb3JtLiRpbnZhbGlkXFxcIj5cXG4gICAgICAgIENoYW5nZSBQYXNzd29yZFxcbiAgICAgIDwvYnV0dG9uPlxcbiAgICA8L2Zvcm0+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48ZGl2IGNsYXNzPVxcXCJ2YWxpZGF0aW9uLWVycm9yc1xcXCIgbmctc2hvdz1cXFwicHJvZmlsZUZvcm0uJGludmFsaWRcXFwiPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJwcm9maWxlRm9ybS5vbGRQYXNzd29yZC4kZXJyb3IucmVxdWlyZWRcXFwiPlxcbiAgICBDdXJyZW50IFBhc3N3b3JkIFJlcXVpcmVkLlxcbiAgPC9sYWJlbD5cXG4gIDxsYWJlbCBjbGFzcz1cXFwidXNlci1lcnJvclxcXCIgbmctc2hvdz1cXFwicHJvZmlsZUZvcm0ubmV3UGFzc3dvcmQuJGVycm9yLnJlcXVpcmVkXFxcIj5cXG4gICAgTmV3IFBhc3N3b3JkIFJlcXVpcmVkLlxcbiAgPC9sYWJlbD5cXG4gIDxsYWJlbCBjbGFzcz1cXFwidXNlci1lcnJvclxcXCIgbmctc2hvdz1cXFwicHJvZmlsZUZvcm0uY29uZmlybVBhc3N3b3JkLiRlcnJvci5yZXF1aXJlZFxcXCI+XFxuICAgIENvbmZpcm0gUGFzc3dvcmQgUmVxdWlyZWQuXFxuICA8L2xhYmVsPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJwcm9maWxlRm9ybS5uZXdQYXNzd29yZC4kZXJyb3IuZXF1YWxzXFxcIj5cXG4gICAgUGFzc3dvcmRzIGRvIG5vdCBtYXRjaC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIFxcbiAgICBuZy1zaG93PVxcXCJcXG4gICAgICBwcm9maWxlRm9ybS5vbGRQYXNzd29yZC4kZXJyb3IubWlubGVuZ3RoIHx8IFxcbiAgICAgIHByb2ZpbGVGb3JtLm5ld1Bhc3N3b3JkLiRlcnJvci5taW5sZW5ndGggfHwgXFxuICAgICAgcHJvZmlsZUZvcm0uY29uZmlybVBhc3N3b3JkLiRlcnJvci5taW5sZW5ndGggfHwgXFxuICAgICAgcHJvZmlsZUZvcm0ub2xkUGFzc3dvcmQuJGVycm9yLm1heGxlbmd0aCB8fCBcXG4gICAgICBwcm9maWxlRm9ybS5uZXdQYXNzd29yZC4kZXJyb3IubWF4bGVuZ3RoIHx8IFxcbiAgICAgIHByb2ZpbGVGb3JtLmNvbmZpcm1QYXNzd29yZC4kZXJyb3IubWF4bGVuZ3RoXFxcIlxcbiAgICA+XFxuICAgIFBhc3N3b3JkcyBtdXN0IGJlIGF0IGJldHdlZW4gNi0xMiBjaGFyYWN0ZXJzLlxcbiAgPC9sYWJlbD5cXG48L2Rpdj5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJwYXJ0aWFscy9xdWlja3N0YXJ0L2ZvcmdvdC1wYXNzd29yZC10ZW1wbGF0ZS5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJ1c2VyLWNvbnRhaW5lclxcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBmb3JtLWNvbnRhaW5lciBjZW50ZXItdGV4dFxcXCI+XFxuICAgIDxoNT5UbyByZXNldCBwYXNzd29yZCwgcGxlYXNlIGNvbnRhY3QgXFxcImV4YW1wbGVAZ21haWwuY29tXFxcIi48L2g1PlxcbiAgICA8YSBjbGFzcz1cXFwiYnV0dG9uIGdyZXlcXFwiIG5nLWhyZWY9XFxcIiMvbG9naW5cXFwiPkNhbmNlbDwvYT5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhcnRpYWxzL3F1aWNrc3RhcnQvbG9naW4tZm9ybS10ZW1wbGF0ZS5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJ1c2VyLWNvbnRhaW5lclxcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXItdGV4dFxcXCI+XFxuICAgIDxmb3JtIG5hbWU9XFxcImxvZ2luRm9ybVxcXCIgbmctc3VibWl0PVxcXCJhdXRoU2VydmljZS5sb2dpbih1c2VyKVxcXCIgbm92YWxpZGF0ZT5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPiAgICBcXG4gICAgICAgIDxoMz5TaWduIEluPC9oMz5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgIDxsYWJlbD5FbWFpbDwvbGFiZWw+XFxuICAgICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgICBpZD1cXFwiZW1haWxcXFwiIFxcbiAgICAgICAgICAgIG5hbWU9XFxcImVtYWlsXFxcIlxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ1LWZ1bGwtd2lkdGggbmctaW52YWxpZFxcXCIgXFxuICAgICAgICAgICAgdHlwZT1cXFwidGV4dFxcXCIgIFxcbiAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VyLmVtYWlsXFxcIlxcbiAgICAgICAgICAgIG5nLXBhdHRlcm49XFxcIi9eW19hLXowLTldKyhcXFxcLltfYS16MC05XSspKkBbYS16MC05LV0rKFxcXFwuW2EtejAtOS1dKykqKFxcXFwuW2Etel17Miw0fSkkL1xcXCJcXG4gICAgICAgICAgICByZXF1aXJlZFxcbiAgICAgICAgICAgIC8+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIFxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj4gICAgICBcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwidS1mdWxsLXdpZHRoXFxcIj4gIFxcbiAgICAgICAgICAgIDxsYWJlbD5QYXNzd29yZDwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IFxcbiAgICAgICAgICAgICAgaWQ9XFxcInBhc3N3b3JkXFxcIiBcXG4gICAgICAgICAgICAgIG5hbWU9XFxcInBhc3N3b3JkXFxcIlxcbiAgICAgICAgICAgICAgY2xhc3M9XFxcInUtZnVsbC13aWR0aFxcXCIgXFxuICAgICAgICAgICAgICB0eXBlPVxcXCJwYXNzd29yZFxcXCIgXFxuICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwidXNlci5wYXNzd29yZFxcXCJcXG4gICAgICAgICAgICAgIG5nLW1pbmxlbmd0aD1cXFwiNlxcXCJcXG4gICAgICAgICAgICAgIG5nLW1heGxlbmd0aD1cXFwiMTJcXFwiXFxuICAgICAgICAgICAgICByZXF1aXJlZC8+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8YnV0dG9uIGlkPVxcXCJzaWduSW5cXFwiIGNsYXNzPVxcXCJidXR0b24tcHJpbWFyeSBmb3JtLWJ1dHRvblxcXCIgdHlwZT1cXFwic3VibWl0XFxcIiBuZy1kaXNhYmxlZD1cXFwibG9naW5Gb3JtLiRpbnZhbGlkXFxcIj5TaWduIEluPC9idXR0b24+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICA8YSBcXG4gICAgICAgICAgICBpZD1cXFwicmVnaXN0ZXJcXFwiIFxcbiAgICAgICAgICAgIGNsYXNzPVxcXCJ1c2VyLW1hbmFnbWVudC1saW5rXFxcIiBcXG4gICAgICAgICAgICBuZy1ocmVmPVxcXCIjcmVnaXN0ZXJcXFwiPlJlZ2lzdGVyPC9hPlxcbiAgICAgICAgICA8YSBcXG4gICAgICAgICAgICBpZD1cXFwiZm9yZ290LXBhc3N3b3JkXFxcIiBcXG4gICAgICAgICAgICBjbGFzcz1cXFwidXNlci1tYW5hZ21lbnQtbGlua1xcXCIgXFxuICAgICAgICAgICAgbmctaHJlZj1cXFwiI2ZvcmdvdFBhc3N3b3JkXFxcIj5Gb3Jnb3QgUGFzc3dvcmQ/PC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuICAgIDwvZm9ybT5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInZhbGlkYXRpb24tZXJyb3JzXFxcIiBuZy1zaG93PVxcXCJsb2dpbkZvcm0uJGludmFsaWRcXFwiPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJsb2dpbkZvcm0uZW1haWwuJGVycm9yLnJlcXVpcmVkXFxcIj5cXG4gICAgRW1haWwgUmVxdWlyZWQuXFxuICA8L2xhYmVsPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJsb2dpbkZvcm0uZW1haWwuJGVycm9yLnBhdHRlcm5cXFwiPlxcbiAgICBFbWFpbCBtdXN0IGJlIHZhbGlkIGVtYWlsIGZvcm1hdC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIG5nLXNob3c9XFxcImxvZ2luRm9ybS5wYXNzd29yZC4kZXJyb3IucmVxdWlyZWRcXFwiPlxcbiAgICBQYXNzd29yZCBSZXF1aXJlZC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIG5nLXNob3c9XFxcImxvZ2luRm9ybS5wYXNzd29yZC4kZXJyb3IubWlubGVuZ3RoIHx8IGxvZ2luRm9ybS5wYXNzd29yZC4kZXJyb3IubWF4bGVuZ3RoXFxcIj5cXG4gICAgUGFzc3dvcmRzIG11c3QgYmUgYXQgYmV0d2VlbiA2LTEyIGNoYXJhY3RlcnMuXFxuICA8L2xhYmVsPlxcbjwvZGl2PlwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhcnRpYWxzL3F1aWNrc3RhcnQvcHJvZmlsZS10ZW1wbGF0ZS5odG1sXCIsXCI8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcbiAgPGgzPlByb2ZpbGU8L2gzPlxcbiAgPGhyPlxcblxcbiAgPGZvcm0+XFxuICAgIDxsYWJlbD5OYW1lOjwvbGFiZWw+XFxuICAgIDxoND57e2N1cnJlbnRVc2VyLm5hbWV9fTwvaDQ+XFxuICAgIDxsYWJlbD5MYXN0IExvZ2dlZCBJbjo8L2xhYmVsPlxcbiAgICA8aDQ+e3tjdXJyZW50VXNlci5sYXN0TG9nZ2VkSW59fTwvaDQ+XFxuXFxuICAgIDxocj5cXG4gICAgPGEgaWQ9XFxcImNoYW5nZVBhc3N3b3JkXFxcIiBocmVmPVxcXCIvI2NoYW5nZVBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIj5DaGFuZ2UgUGFzc3dvcmQ8L2E+XFxuICA8L2Zvcm0+XFxuPC9kaXY+XFxuXCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwicGFydGlhbHMvcXVpY2tzdGFydC9yZWdpc3Rlci11c2VyLXRlbXBsYXRlLmh0bWxcIixcIjxkaXYgY2xhc3M9XFxcInVzZXItY29udGFpbmVyXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGZvcm0tY29udGFpbmVyIGNlbnRlci10ZXh0IHJpZ2h0XFxcIj5cXG4gICAgPGZvcm0gbmFtZT1cXFwicmVnaXN0ZXJGb3JtXFxcIiBuZy1zdWJtaXQ9XFxcImF1dGhTZXJ2aWNlLmNyZWF0ZVVzZXIodXNlcilcXFwiIG5vdmFsaWRhdGU+XFxuICAgICAgPGgzPlJlZ2lzdGVyPC9oMz5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGxhYmVsPkVtYWlsPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgaWQ9XFwnZW1haWxcXCcgXFxuICAgICAgICAgIG5hbWU9XFwnZW1haWxcXCdcXG4gICAgICAgICAgY2xhc3M9XFxcInUtZnVsbC13aWR0aFxcXCIgXFxuICAgICAgICAgIHR5cGU9XFwnZW1haWxcXCcgXFxuICAgICAgICAgIG5nLW1vZGVsPVxcXCJ1c2VyLmVtYWlsXFxcIiBcXG4gICAgICAgICAgbmctcGF0dGVybj1cXFwiL15bX2EtejAtOV0rKFxcXFwuW19hLXowLTldKykqQFthLXowLTktXSsoXFxcXC5bYS16MC05LV0rKSooXFxcXC5bYS16XXsyLDR9KSQvXFxcIlxcbiAgICAgICAgICByZXF1aXJlZD5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGxhYmVsPlBhc3N3b3JkPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgaWQ9XFwncGFzc3dvcmRcXCcgXFxuICAgICAgICAgIG5hbWU9XFxcInBhc3N3b3JkXFxcIlxcbiAgICAgICAgICBjbGFzcz1cXFwidS1mdWxsLXdpZHRoXFxcIiBcXG4gICAgICAgICAgdHlwZT1cXCdwYXNzd29yZFxcJyBcXG4gICAgICAgICAgbmctbW9kZWw9XFxcInVzZXIucGFzc3dvcmRcXFwiIFxcbiAgICAgICAgICBuZy1taW5sZW5ndGg9XFxcIjZcXFwiXFxuICAgICAgICAgIG5nLW1heGxlbmd0aD1cXFwiMTJcXFwiXFxuICAgICAgICAgIGVxdWFscz1cXFwie3t1c2VyLmNvbmZpcm1QYXNzd29yZH19XFxcIlxcbiAgICAgICAgICByZXF1aXJlZD5cXG4gICAgICA8L2Rpdj5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGxhYmVsIGZvcj1cXFwiY29uZmlybVBhc3N3b3JkXFxcIj5Db25maXJtIFBhc3N3b3JkPC9sYWJlbD5cXG4gICAgICAgIDxpbnB1dCBcXG4gICAgICAgICAgaWQ9XFxcImNvbmZpcm1QYXNzd29yZFxcXCJcXG4gICAgICAgICAgbmFtZT1cXFwiY29uZmlybVBhc3N3b3JkXFxcIlxcbiAgICAgICAgICBjbGFzcz1cXFwidS1mdWxsLXdpZHRoXFxcIiBcXG4gICAgICAgICAgbmctbW9kZWw9XFxcInVzZXIuY29uZmlybVBhc3N3b3JkXFxcIiBcXG4gICAgICAgICAgdHlwZT1cXCdwYXNzd29yZFxcJyBcXG4gICAgICAgICAgbmctbWlubGVuZ3RoPVxcXCI2XFxcIlxcbiAgICAgICAgICBuZy1tYXhsZW5ndGg9XFxcIjEyXFxcIlxcbiAgICAgICAgICBlcXVhbHM9XFxcInt7dXNlci5wYXNzd29yZH19XFxcIlxcbiAgICAgICAgICByZXF1aXJlZFxcbiAgICAgICAgICA+XFxuICAgICAgPC9kaXY+XFxuICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvblxcXCIgbmctaHJlZj1cXFwiIy9sb2dpblxcXCI+Q2FuY2VsPC9hPlxcbiAgICAgIDxidXR0b24gaWQ9XFxcInNpZ25VcFxcXCIgY2xhc3M9XFxcImJ1dHRvbi1wcmltYXJ5IGZvcm0tYnV0dG9uXFxcIiB0eXBlPVxcXCJzdWJtaXRcXFwiIG5nLWRpc2FibGVkPVxcXCJyZWdpc3RlckZvcm0uJGludmFsaWRcXFwiPlJlZ2lzdGVyPC9idXR0b24+XFxuICAgIDwvZm9ybT5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxkaXYgY2xhc3M9XFxcInZhbGlkYXRpb24tZXJyb3JzXFxcIiBuZy1zaG93PVxcXCJyZWdpc3RlckZvcm0uJGludmFsaWRcXFwiPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJyZWdpc3RlckZvcm0uZW1haWwuJGVycm9yLnJlcXVpcmVkXFxcIj5cXG4gICAgRW1haWwgUmVxdWlyZWQuXFxuICA8L2xhYmVsPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJ1c2VyLWVycm9yXFxcIiBuZy1zaG93PVxcXCJyZWdpc3RlckZvcm0uZW1haWwuJGVycm9yLnBhdHRlcm5cXFwiPlxcbiAgICBFbWFpbCBtdXN0IGJlIHZhbGlkIGVtYWlsIGZvcm1hdC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIG5nLXNob3c9XFxcInJlZ2lzdGVyRm9ybS5wYXNzd29yZC4kZXJyb3IucmVxdWlyZWRcXFwiPlxcbiAgICBQYXNzd29yZCBSZXF1aXJlZC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIG5nLXNob3c9XFxcInJlZ2lzdGVyRm9ybS5jb25maXJtUGFzc3dvcmQuJGVycm9yLnJlcXVpcmVkXFxcIj5cXG4gICAgQ29uZmlybSBQYXNzd29yZCBSZXF1aXJlZC5cXG4gIDwvbGFiZWw+XFxuICA8bGFiZWwgY2xhc3M9XFxcInVzZXItZXJyb3JcXFwiIFxcbiAgICBuZy1zaG93PVxcXCJcXG4gICAgICByZWdpc3RlckZvcm0ucGFzc3dvcmQuJGVycm9yLm1pbmxlbmd0aCB8fCBcXG4gICAgICByZWdpc3RlckZvcm0ucGFzc3dvcmQuJGVycm9yLm1heGxlbmd0aCB8fCBcXG4gICAgICByZWdpc3RlckZvcm0uY29uZmlybVBhc3N3b3JkLiRlcnJvci5taW5sZW5ndGggfHwgXFxuICAgICAgcmVnaXN0ZXJGb3JtLmNvbmZpcm1QYXNzd29yZC4kZXJyb3IubWF4bGVuZ3RoXFxcIlxcbiAgICA+XFxuICAgIFBhc3N3b3JkcyBtdXN0IGJlIGF0IGJldHdlZW4gNi0xMiBjaGFyYWN0ZXJzLlxcbiAgPC9sYWJlbD5cXG4gIDxsYWJlbCBjbGFzcz1cXFwidXNlci1lcnJvclxcXCIgbmctc2hvdz1cXFwicmVnaXN0ZXJGb3JtLnBhc3N3b3JkLiRlcnJvci5lcXVhbHNcXFwiPlxcbiAgICBQYXNzd29yZHMgZG8gbm90IG1hdGNoLlxcbiAgPC9sYWJlbD5cXG48L2Rpdj5cIik7fV0pOyJdfQ==
