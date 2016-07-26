class DashboardCtrl {
  constructor($state, $q, CommentService, UserService, RequestService, FlashService) {
    this.$state = $state;
    this.$q = $q;

    this.requests = [];

    UserService.currentUser().then(user => {
      this.currentUser = user;

      RequestService.all().then(requests => {
        this.requests = requests;
      });

      CommentService.where({ relatedClient: user.relatedClient }).then(comments => {
        this.recentComments = comments.slice(0, 5);
      });
    });
  }

  onClickRow(id) {
    this.$state.go('app.requestEditor', { id });
  }

  get openRequests() {
    return this.requests.filter(req => { return req.status === 'Open' }).length;
  }

  get inProgresRequests() {
    return this.requests.filter(req => { return req.status === 'In Progress' }).length;
  }

  get completeRequests() {
    return this.requests.filter(req => { return req.status === 'Complete' }).length;
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.component.html",
  controller: DashboardCtrl
}