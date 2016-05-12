import "./user-management/quickstart-users";
import "../tmp/templates";

import "./shared";
import "./dashboard";

const DEPENDENCIES = [
  'ui.router',
  'quickstart-users',
  'templates',
  'app.shared',
  'app.dashboard'
];

angular.module('app', DEPENDENCIES)

angular.bootstrap(document, ['app']);