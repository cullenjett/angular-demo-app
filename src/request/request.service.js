export default class RequestService {
  constructor($q, quickbase, AttachmentService, Flash, UserService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.AttachmentService = AttachmentService;
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
        }, {slist: 'dateCreated', options: 'sortorder-D'}, (res) => {
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
      this.quickbase.requests.doQuery({ id }, {slist: 'dateCreated', options: 'sortorder-D'}, (res) => {
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
      let safeRequest = {
        type: request.type,
        priority: request.priority,
        description: request.description
      };

      this.quickbase.requests.editRecord(request.id, safeRequest, (res) => {
        if (res.error) {
          this.Flash.error(res.error.message);
        }

        if (request.attachments && request.attachments.length) {
          this.AttachmentService.add(request.attachments, request.id).then(() => {
            dfd.resolve(true);
          });
        } else {
          dfd.resolve(true);
        }
      })
    } else {
      this.UserService.currentUser().then(user => {
        request.relatedUser = user.id;
        request.status = 'Open';

        this.quickbase.requests.addRecord(request, (res) => {
          if (res.error) {
            this.Flash.error(res.error.message);
          }

          let newId = res;
          let d = new Date();

          request.id = newId;
          request.relatedUserName = user.name;
          request.dateCreated = d.getTime();

          if (this.allRequests) {
            this.allRequests.unshift(request);
          }

          if (request.attachments && request.attachments.length) {
            this.AttachmentService.add(request.attachments, request.id).then(() => {
              dfd.resolve(true);
            });
          } else {
            dfd.resolve(true);
          }

        });
      });
    }

    return dfd.promise;
  }
}