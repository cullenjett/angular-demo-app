import "./user-management/quickstart-users";
import "../tmp/templates";

import "./dashboard";
import "./request";
import "./shared";

const DEPENDENCIES = [
  'ui.router',
  'quickstart-users',
  'templates',
  'app.dashboard',
  'app.request',
  'app.shared'
];

angular.module('app', DEPENDENCIES)

angular.bootstrap(document, ['app']);