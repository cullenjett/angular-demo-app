class DashboardCtrl {
  constructor(UserService) {
    UserService.currentUser().then(user => { this.currentUser = user; })
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.tmpl.html",
  controller: DashboardCtrl
}