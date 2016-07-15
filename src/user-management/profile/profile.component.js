class ProfileCtrl {
  constructor(AuthService) {
  	this.AuthService = AuthService;
  }
}

export default {
  bindings: {},
  templateUrl: 'user-management/profile/profile.component.html',
  controller: ProfileCtrl
}