class DashboardCtrl {
  constructor(UserService, RequestService, Flash) {
    this.recentRequests = [];
    this.isLoading = true;

    UserService.currentUser().then(user => {
      this.currentUser = user;
      return RequestService.where({ relatedClient: user.relatedClient })
    }).then(requests => {
      this.isLoading = false;
      this.recentRequests = requests;
    })
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.component.html",
  controller: DashboardCtrl
}