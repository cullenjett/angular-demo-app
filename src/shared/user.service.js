export default class UserService {
  constructor($q, AuthService, quickbase) {
    this.$q = $q;
    this.authToken = AuthService.currentUser();
    this.quickbase = quickbase;

    this.current = null;
  }

  currentUser() {
    let dfd = this.$q.defer();

    if (this.current) {
      dfd.resolve(this.current)
    } else {
      this.quickbase.users.doQuery({
        username: this.authToken.username
      }, {}, (user) => {
        this.current = user;
        dfd.resolve(user);
      })
    }

    return dfd.promise;
  }
}