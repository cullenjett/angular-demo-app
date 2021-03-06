import AttachmentService from './attachment.service';
import FileUploaderComponent from './file-uploader/file-uploader.component';
import quickbase from './quickbase-client';
import SortableTableComponent from './sortable-table/sortable-table.component';
import UserService from './user.service';
import FlashService from './flash.service';

angular
  .module('app.shared', [])
  .constant('quickbase', quickbase)
  .component('fileUploader', FileUploaderComponent)
  .component('sortableTable', SortableTableComponent)
  .service('AttachmentService', AttachmentService)
  .service('UserService', UserService)
  .service('FlashService', FlashService)