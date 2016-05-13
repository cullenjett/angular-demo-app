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
  })

angular.bootstrap(document, ['app']);