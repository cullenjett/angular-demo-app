import "./dashboard";
import "./files";
import "./layout";
import "./request";
import "./shared";
import './user-management';
import "../tmp/templates";

const DEPENDENCIES = [
  'ui.router',
  'templates',
  'app.dashboard',
  'app.files',
  'app.layout',
  'app.request',
  'app.shared',
  'app.user-management',
];

angular
  .module('app', DEPENDENCIES)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'layout/app-layout.html'
      })

    $urlRouterProvider.otherwise('/');
  })
  .run($rootScope => {
    // Change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, nextState) => {
      $rootScope.setPageTitle(nextState.title);
    });

    // Helper method for setting the page's title
    $rootScope.setPageTitle = (title) => {
      if (title) {
        $rootScope.pageTitle = title;
      }
    };
  })

angular.bootstrap(document, ['app']);