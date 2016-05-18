import RequestsComponent from './requests.component';
import RequestEditorComponent from './editor/editor.component';
import RequestService from './request.service';

angular
  .module('app.request', [])
  .component('requests', RequestsComponent)
  .component('requestEditor', RequestEditorComponent)
  .config(($stateProvider) => {
    $stateProvider
      .state('app.requests', {
        url: '/requests',
        template: '<requests></requests>',
        title: 'Requests'
      })

      .state('app.requestEditor', {
        url: '/requests/editor/:id',
        template: '<request-editor request="request"></request-editor>',
        title: 'Editor'
      })
  })
  .service('RequestService', RequestService)