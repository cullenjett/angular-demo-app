import quickbase from './quickbase-client';

angular
  .module('app.shared', [])
  .constant('quickbase', quickbase)