import Base from "../../shared/quickbase-client"
import Config from "../../../quickstart.config.js"

export default class AuthService {
  constructor($rootScope, $q, FlashService, AUTH_EVENTS) {
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.FlashService = FlashService;
    this.AUTH_EVENTS = AUTH_EVENTS;
  }

  ticket(){
    const cookie = BaseHelpers.getCookie("quickstart_session");

    if(cookie){
      return JSON.parse(cookie).ticket;
    };

    return "";
  }

  currentUser(){
    let cookie = BaseHelpers.getCookie("quickstart_session");

    if(cookie){
      cookie = JSON.parse(cookie);
      cookie["lastLoggedIn"] = BaseHelpers.dateTimeToString(cookie.lastLoggedIn, Config.timezone);
      return cookie;
    };

    return "";
  }

  isLoggedIn(){
    return this.ticket() != "";
  }

  init(){
    const _self = this;
    const ticket = this.ticket();

    if(ticket){
      _self.$rootScope.$broadcast(_self.AUTH_EVENTS.loginSuccess);
    }else{
      _self.$rootScope.$broadcast(_self.AUTH_EVENTS.notAuthenticated);
    };
  }

  attemptAuth(type, user) {
    const _self = this;

    const dfd = _self.$q.defer();
    const currentUser = { username: user.email, password: user.password };

    Base.quickstart[type](currentUser, function(response){
      if (response.error) {
        _self.$rootScope.$broadcast(_self.AUTH_EVENTS.loginFailed);
        _self.FlashService.error(response.error.message);
        dfd.resolve(false);
      } else {
        _self.$rootScope.$broadcast(_self.AUTH_EVENTS.loginSuccess);
        dfd.resolve(true)
      };
    });

    return dfd.promise;
  }

  logout() {
    const _self = this;
    Base.quickstart.signOut(function(response){
      _self.$rootScope.$broadcast(_self.AUTH_EVENTS.logoutSuccess);
    });
  }
}