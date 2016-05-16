import "./user-management/quickstart-users";
import "../tmp/templates";

import "./dashboard";
import "./layout";
import "./request";
import "./shared";

const DEPENDENCIES = [
  'ui.router',
  'quickstart-users',
  'templates',
  'app.dashboard',
  'app.layout',
  'app.request',
  'app.shared'
];

angular
  .module('app', DEPENDENCIES)
  .config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'layout/app-layout.tmpl.html'
      })

    $urlRouterProvider.otherwise('/')
  })
  .run($rootScope => {
    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, nextState) => {
      $rootScope.setPageTitle(nextState.title);
    });

    // Helper method for setting the page's title
    $rootScope.setPageTitle = (title) => {
      $rootScope.pageTitle = '';
      if (title) {
        $rootScope.pageTitle += title;
      }
    };
  })

angular.bootstrap(document, ['app']);