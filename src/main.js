import "./user-management/quickstart-users";
import "../tmp/templates";
import Base from "./shared/quickbase-client";

const DEPENDENCIES = [
  'ngRoute',
  'quickstart-users',
  'templates'
];

angular.module('app', DEPENDENCIES)

angular.bootstrap(document, ['app']);