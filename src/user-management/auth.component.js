class AuthCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;
    this.title = (this.authType === 'login') ? "Sign In" : "Register";
  }

  submit(formData) {
    // TODO: AuthService needs a heavy refactoring so it only handles the authentication and not view logic
    this.AuthService.login(formData)
  }
}

export default {
  bindings: {
    authType: '@type'
  },
  templateUrl: 'user-management/auth.tmpl.html',
  controller: AuthCtrl
}