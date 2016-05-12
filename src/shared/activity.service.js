export default class ActivityService {
  constructor($q, quickbase) {
    this.$q = $q;
    this.quickbase = quickbase;
  }

  getAll() {
    let dfd = this.$q.defer()

    this.quickbase.activities.doQuery({
      rid: {XEX: ''}
    }, {}, function(activities) {
      dfd.resolve(activities)
    })

    return dfd.promise;
  }
}