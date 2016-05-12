import "./user-management/quickstart-users";
import "../tmp/templates";
import Base from "./shared/quickbase-client";

import "./dashboard"

const DEPENDENCIES = [
  'ngRoute',
  'quickstart-users',
  'templates',
  'app.dashboard'
];

angular.module('app', DEPENDENCIES)

angular.bootstrap(document, ['app']);