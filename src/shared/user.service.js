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
      }, {}, (res) => {
        let user = res[0];
        this.current = user;
        dfd.resolve(user);
      })
    }

    return dfd.promise;
  }
}