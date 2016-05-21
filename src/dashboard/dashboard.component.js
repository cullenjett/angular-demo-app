class DashboardCtrl {
  constructor($state, $q, CommentService, UserService, RequestService, Flash) {
    this.$state = $state;
    this.$q = $q;

    this.recentRequests = [];
    this.recentComments = [];
    this.loadingRequests = true;
    this.loadingComments = true;

    UserService.currentUser().then(user => {
      this.currentUser = user;

      RequestService.findForUser(user.id).then(requests => {
        this.loadingRequests = false;
        this.recentRequests = requests.slice(0, 5);
      });

      CommentService.where({ relatedUser: user.id }).then(comments => {
        this.loadingComments = false;
        this.recentComments = comments.slice(0, 5);
      });
    });
  }

  onClickRow(id) {
    this.$state.go('app.requestEditor', { id });
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.component.html",
  controller: DashboardCtrl
}