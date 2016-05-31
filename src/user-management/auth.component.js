class AuthCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;

    this.isSubmitting = false;
    this.title = (this.authType === 'signIn') ? "Sign In" : "Register";
    this.formData = {
      email: 'test@example.com',
      password: 'password'
    };
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