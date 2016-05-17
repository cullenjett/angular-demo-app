import quickbase from './quickbase-client';
import SortableTableComponent from './sortable-table/sortable-table.component'
import UserService from './user.service';

angular
  .module('app.shared', [])
  .constant('quickbase', quickbase)
  .component('sortableTable', SortableTableComponent)
  .service('UserService', UserService)