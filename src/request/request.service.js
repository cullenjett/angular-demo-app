export default class RequestService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }

  where(query) {
    let dfd = this.$q.defer();

    this.quickbase.requests.doQuery(query, {}, (res) => {
      if (res.error) {
        dfd.reject(res.error)
      } else {
        dfd.resolve(res);
      }
    })

    return dfd.promise;
  }
}