import RequestsComponent from './requests.component';
import RequestService from './request.service';

angular
  .module('app.request', [])
  .component('requests', RequestsComponent)
  .config(($stateProvider) => {
    $stateProvider
      .state('app.requests', {
        url: '/requests',
        template: '<requests></requests>',
        title: 'Requests'
      })
  })
  .service('RequestService', RequestService)