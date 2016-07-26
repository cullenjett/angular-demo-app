export default class FlashService {
  constructor() {

  }

  error(message){
    this.display(message, "error");
  }

  success(message){
    this.display(message, "success");
  }

  display(message, alertClass){
    $("#alert-flyover").html(message).removeClass("error, success");
    $("#alert-flyover").addClass("in").addClass(alertClass);
    setTimeout(function(){
      $("#alert-flyover").removeClass("in");
    }, 3500);
  }
}