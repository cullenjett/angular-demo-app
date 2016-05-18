export default class RequestService {
  constructor($q, quickbase, Flash, UserService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.Flash = Flash;
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
          if (res.error) {
            this.Flash.error(res.error.message);
          }

          this.allRequests = res;
          dfd.resolve(res);
        })
      });
    }

    return dfd.promise;
  }

  find(id) {
    let dfd = this.$q.defer();

    if (this.allRequests) {
      let matchingRequest = this.allRequests.filter(req => { return req.id == id })[0];
      dfd.resolve(matchingRequest);
    } else {
      this.quickbase.requests.doQuery({ id }, {}, (res) => {
        if (res.error) {
          this.Flash.error(res.error.message);
        }

        dfd.resolve(res[0])
      });
    }


    return dfd.promise;
  }

  findForUser(userId) {
    let dfd = this.$q.defer();

    const filterRequests = (requests) => {
      return requests.filter(req => {
        return req.relatedUser == userId;
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

  save(request) {
    let dfd = this.$q.defer();

    if (request.id) {
      this.quickbase.requests.importFromCSV([request], (res) => {
        if (res.error) {
          this.Flash.error(res.error.message);
        }

        dfd.resolve(true);
      })
    } else {
      this.UserService.currentUser().then(user => {
        request.relatedUser = user.id;
        request.status = 'Open';

        this.quickbase.requests.addRecord(request, (res) => {
          if (res.error) {
            this.Flash.error(res.error.message);
          }

          if (this.allRequests) {
            let newId = res;
            let d = new Date();

            request.id = newId;
            request.relatedUserName = user.name;
            request.dateCreated = d.getTime();

            this.allRequests.unshift(request);

            dfd.resolve(true);
          } else {
            dfd.resolve(true);
          }
        });
      });
    }

    return dfd.promise;
  }
}