class DashboardCtrl {
  constructor(UserService, RequestService, Flash) {
    this.myRequests = [];
    this.isLoading = true;

    UserService.currentUser().then(user => {
      this.currentUser = user;
      return RequestService.findForUser(user.id)
    }).then(requests => {
      this.isLoading = false;
      this.myRequests = requests;
    })
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.tmpl.html",
  controller: DashboardCtrl
}