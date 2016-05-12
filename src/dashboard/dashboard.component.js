class DashboardCtrl {
  constructor(AuthService, ActivityService) {
    this.currentUser = AuthService.currentUser()
    ActivityService.getAll().then(activities => this.activities = activities);
  }
}

export default {
  bindings: {},
  templateUrl: "dashboard/dashboard.tmpl.html",
  controller: DashboardCtrl
}