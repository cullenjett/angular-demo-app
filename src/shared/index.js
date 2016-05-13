import quickbase from './quickbase-client';
import UserService from './user.service';

angular
  .module('app.shared', [])
  .constant('quickbase', quickbase)
  .service('UserService', UserService)