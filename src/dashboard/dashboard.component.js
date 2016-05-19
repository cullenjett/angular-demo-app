class DashboardCtrl {
  constructor($state, UserService, RequestService, Flash) {
    this.$state = $state;

    this.recentRequests = [];
    this.isLoading = true;

    UserService.currentUser().then(user => {
      this.currentUser = user;
      return RequestService.findForUser(user.id)
    }).then(requests => {
      this.isLoading = false;
      this.recentRequests = requests;
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