class DashboardCtrl {
  constructor(UserService, RequestService) {
    UserService.currentUser().then(user => {
      this.currentUser = user;
      return RequestService.findForUser(user.id)
    }).then(requests => {
      this.myRequests = requests;
    })
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.tmpl.html",
  controller: DashboardCtrl
}