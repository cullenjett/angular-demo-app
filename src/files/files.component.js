class FilesCtrl {
  constructor(FileService) {
    this.FileService = FileService;

    this.FileService.all().then(files => {
      this.files = files;
      console.log(this.files)
    })
  }
}

export default {
  bindings: {},
  templateUrl: 'files/files.component.html',
  controller: FilesCtrl
}