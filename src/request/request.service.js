export default class RequestService {
  constructor($q, quickbase, UserService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.UserService = UserService;

    this.allRequests = null;
  }

  all() {
    let dfd = this.$q.defer();

    if (this.allRequests) {
      dfd.resolve(this.allRequests);
    } else {
      this.UserService.currentUser().then(user => {
        this.quickbase.requests.doQuery({
          relatedClient: user.relatedClient
        }, {}, (res) => {
          this.allRequests = res;
          dfd.resolve(res);
        })
      });
    }

    return dfd.promise;
  }

  findForUser(id) {
    let dfd = this.$q.defer();

    const filterRequests = (requests) => {
      return requests.filter(req => {
        return req.relatedUser == id;
      })
    };

    if (this.allRequests) {
      dfd.resolve(filterRequests(this.allRequests));
    } else {
      this.all().then(requests => {
        dfd.resolve(filterRequests(requests))
      });
    }

    return dfd.promise;
  }

  where(query) {
    let dfd = this.$q.defer();

    this.quickbase.requests.doQuery(query, {}, (res) => {
      dfd.resolve(res);
    })

    return dfd.promise;
  }
}