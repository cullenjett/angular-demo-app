import Base from "../../shared/quickbase-client"

class ChangePasswordCtrl {
  constructor(AuthService) {
    this.AuthService = AuthService;
  }

  changePassword(user){
    const _self = this;

    $("#changePassword").attr("disabled", "disabled").html("Processing...");

    user = {
      newPassword: user.newPassword,
      currentPassword: user.oldPassword
    };

    Base.quickstart.changePassword(user, function(response){
      if(response.error){
        _self.FlashService.error(response.error.message);
        $("#changePassword").removeAttr("disabled").html("Change Password");
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