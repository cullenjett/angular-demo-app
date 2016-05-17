class AuthCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;
    this.title = (this.authType === 'signIn') ? "Sign In" : "Register";
  }

  submit(formData) {
    this.isSubmitting = true;

    this.AuthService.attemptAuth(this.authType, formData).then(res => {
      this.isSubmitting = false;
    });
  }
}

export default {
  bindings: {
    authType: '@type'
  },
  templateUrl: 'user-management/auth.component.html',
  controller: AuthCtrl
}