export default class ActivityService {
  constructor($q, quickbase, AuthService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.AuthService = AuthService;
  }

  getAll() {
    let dfd = this.$q.defer();

    if (this.activities) {
      dfd.resolve(this.activities)
    } else {
      this.quickbase.activities.doQuery({
        rid: {XEX: ''}
      }, {}, (activities) => {
        this.activities = activities;
        dfd.resolve(activities)
      })
    }

    return dfd.promise;
  }

  findByUsername(username) {
    let dfd = this.$q.defer();
    let currentUser = this.AuthService.currentUser().username

    let filterActivities = (activities) => {
      return activities.filter(activity => activity.customerEmail === currentUser);
    }

    if (this.activities) {
      dfd.resolve(filterActivities)
    } else {
      this.quickbase.activities.doQuery({
        customerEmail: currentUser
      }, {}, (activities) => {
        dfd.resolve(activities)
      })
    }

    return dfd.promise;
  }
}