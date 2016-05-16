class AuthCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;
    this.title = (this.authType === 'login') ? "Sign In" : "Register";
  }

  submit(formData) {
    this.isSubmitting = true;

    this.AuthService.login(formData).then(res => {
      this.isSubmitting = false;
    })
  }
}

export default {
  bindings: {
    authType: '@type'
  },
  templateUrl: 'user-management/auth.tmpl.html',
  controller: AuthCtrl
}