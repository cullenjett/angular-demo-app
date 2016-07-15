export default class AttachmentService {
  constructor($q, quickbase, FlashService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.FlashService = FlashService;
  }

  add(files, requestId) {
    let requests = [];

    files.forEach(file => {
      if (!file.id) {
        let dfd = this.$q.defer();

        file.relatedRequest = requestId;

        this.quickbase.attachments.addRecord(file, (res) => {
          if (res.error) {
            this.FlashService.error(res.error.message);
          }

          dfd.resolve(true);
        });

        requests.push(dfd.promise);
      }
    });

    return this.$q.when(requests);
  }

  delete(id) {
    this.quickbase.attachments.purgeRecords({ id }, (res) => {
      if (res.error) {
        this.FlashService.error(res.error.message);
      }
    })
  }

  where(query) {
    let dfd = this.$q.defer();

    this.quickbase.attachments.doQuery(query, {}, (res) => {
      if (res.errror) {
        this.FlashService.error(res.error.message);
      }

      dfd.resolve(res)
    })

    return dfd.promise;
  }
}