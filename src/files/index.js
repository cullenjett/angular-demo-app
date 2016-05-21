import FilesComponent from './files.component';
import FileService from './file.service';

angular
  .module('app.files', [])
  .component('files', FilesComponent)
  .config($stateProvider => {
    $stateProvider
      .state('app.files', {
        url: '/files',
        template: '<files></files>',
        title: 'Files'
      })
  })
  .service('FileService', FileService)