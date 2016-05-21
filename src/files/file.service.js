export default class FileService {
  constructor($q, $sce, quickbase, Flash, UserService) {
    this.$q = $q;
    this.$sce = $sce;
    this.quickbase = quickbase;
    this.Flash = Flash;
    this.UserService = UserService;

    this.allFiles = false;
  }

  all() {
    let dfd = this.$q.defer();

    if (this.allFiles) {
      dfd.resolve(this.allFiles);
      return dfd.promise;
    }

    this.UserService.currentUser().then(user => {
      this.quickbase.attachments.doQuery({
        relatedClient: user.relatedClient
      }, {slist: 'dateCreated', options: 'sortorder-D'}, (res) => {
        if (res.error) {
          this.Flash.error(res.error.message);
        }

        this.allFiles = res.map(attachment => {
          attachment.file.url = this.$sce.trustAsResourceUrl(attachment.file.url);
          attachment.file.filename = attachment.file.filename.replace(/%20/g, ' ');
          return attachment;
        });

        dfd.resolve(this.allFiles);
      });
    });

    return dfd.promise;
  }
}