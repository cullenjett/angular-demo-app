class ForgotPasswordCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;
  }
}

export default {
  bindings: {},
  templateUrl: 'user-management/forgot-password/forgot-password.component.html',
  controller: ForgotPasswordCtrl
}