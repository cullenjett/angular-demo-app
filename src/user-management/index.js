import AuthComponent from './auth/auth.component';
import ChangePasswordComponent from './change-password/change-password.component';
import ForgotPasswordComponent from './forgot-password/forgot-password.component';
import ProfileComponent from './profile/profile.component';
import AuthService from './auth/auth.service';

angular
  .module('app.user-management', ['ui.router', 'templates'])
  .component('auth', AuthComponent)
  .component('changePassword', ChangePasswordComponent)
  .component('forgotPassword', ForgotPasswordComponent)
  .component('profile', ProfileComponent)
  .service('AuthService', AuthService)

  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    notAuthenticated: 'auth-not-authenticated'
  })

  .run(['AuthService', function (AuthService) {
    AuthService.init();
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
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
        template: "<forgot-password></forgot-password>",
        public: true,
        title: 'Forgot Password'
      })
      .state('app.profile', {
        url: '/profile',
        template: "<profile></profile>",
        title: 'Profile'
      })
      .state('app.changePassword', {
        url: '/change-password',
        template: "<change-password></change-password>",
        title: 'Change Password'
      })
    })

  .run(function ($rootScope, $state, FlashService, AuthService, AUTH_EVENTS) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
      $rootScope.currentUser = AuthService.currentUser();

      if(!next.public && !AuthService.isLoggedIn()){
        FlashService.error('Please sign in first.');
        $state.go('app.login');
        event.preventDefault();
      };
    });

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function(){
      $rootScope.currentUser = AuthService.currentUser();
      $state.go('app.dashboard');
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(){
      $rootScope.currentUser = null;
      $state.go('app.login');
    });
  })

  //move this
  .directive('equals', function() {
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
  })