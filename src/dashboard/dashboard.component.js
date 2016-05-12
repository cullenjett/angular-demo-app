class DashboardCtrl {
  constructor(AuthService) {
    this.currentUser = AuthService.currentUser()
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.tmpl.html",
  controller: DashboardCtrl
}