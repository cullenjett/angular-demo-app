import Base from "../../shared/quickbase-client"

class ChangePasswordCtrl {
  constructor($rootScope, AuthService, FlashService, AUTH_EVENTS) {
    this.AuthService = AuthService;
    this.FlashService = FlashService;
    this.AUTH_EVENTS = AUTH_EVENTS;
    this.$rootScope = $rootScope;

    this.formData = {
      name: $rootScope.currentUser.name
    };
  }

  submit(formData){
    const _self = this;
    const user = {
      newPassword: formData.newPassword,
      currentPassword: formData.currentPassword
    };

    Base.quickstart.changePassword(user, function(response){
      if(response.error){
        _self.FlashService.error(response.error.message);
      }else{
        _self.$rootScope.$broadcast(_self.AUTH_EVENTS.loginSuccess);
        _self.FlashService.success(response);
      }
    });
  }
}

export default {
  bindings: {},
  templateUrl: 'user-management/change-password/change-password.component.html',
  controller: ChangePasswordCtrl
}