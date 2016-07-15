class ProfileCtrl {
  constructor($rootScope, AuthService) {
  	this.AuthService = AuthService;

    this.formData = {
      name: $rootScope.currentUser.name,
      username: $rootScope.currentUser.username,
      lastLoggedIn: $rootScope.currentUser.lastLoggedIn
    }
  }

  submit(formData) {
  	
  }
}

export default {
  bindings: {},
  templateUrl: 'user-management/profile/profile.component.html',
  controller: ProfileCtrl
}