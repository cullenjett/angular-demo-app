import "./user-management/quickstart-users";
import "../tmp/templates";

import "./shared";
import "./dashboard";

const DEPENDENCIES = [
  'ngRoute',
  'quickstart-users',
  'templates',
  'app.shared',
  'app.dashboard'
];

angular.module('app', DEPENDENCIES)

angular.bootstrap(document, ['app']);