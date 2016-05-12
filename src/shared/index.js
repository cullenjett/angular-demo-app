import quickbase from './quickbase-client';
import ActivityService from './activity.service';

angular
  .module('app.shared', [])
  .constant('quickbase', quickbase)
  .service('ActivityService', ActivityService)