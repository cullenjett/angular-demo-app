export default class RequestService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }

  findForUser(id) {
    let dfd = this.$q.defer();

    this.quickbase.requests.doQuery({
      relatedUser: id
    }, {}, (requests) => {
      dfd.resolve(requests);
    })

    return dfd.promise;
  }
}