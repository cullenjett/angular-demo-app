class SidenavCtrl {
  constructor(UserService) {
    UserService.currentUser().then(user => { this.currentUser = user; })
  }
}

export default {
  bindings: {},
  templateUrl: 'layout/sidenav.tmpl.html',
  controller: SidenavCtrl
}