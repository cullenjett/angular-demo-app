export default class AttachmentService {
  constructor($q, quickbase, Flash) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.Flash = Flash;
  }

  add(files, requestId) {
    let requests = [];

    files.forEach(file => {
      let dfd = this.$q.defer();

      file.relatedRequest = requestId;

      this.quickbase.attachments.addRecord(file, (res) => {
        if (res.error) {
          this.Flash.error(res.error.message);
        }

        dfd.resolve(true);
      });

      requests.push(dfd.promise);
    });

    return this.$q.when(requests);
  }
}