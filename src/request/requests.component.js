class RequestsCtrl {
  constructor(UserService, RequestService, AuthService) {
    this.activeRequests = [];
    this.isLoading = true;
    this.filters = ['All', 'Open', 'In Progress', 'Closed'];
    this.activeFilter = 'All';

    UserService.currentUser().then(user => {
      this.currentUser = user;
      return RequestService.all()
    }).then(requests => {
      this.allRequests = requests;
      this.activeRequests = requests;
      this.isLoading = false;
    });
  }

  filter(status) {
    if (this.activeFilter === status) {
      return false;
    }

    if (status == 'All') {
      this.activeRequests = this.allRequests;
    } else {
      this.activeRequests = this.allRequests.filter(request => {
        return request.status == status
      });
    }

    this.activeFilter = status;
  }
}

export default {
  bindings: {},
  templateUrl: 'request/requests.component.html',
  controller: RequestsCtrl
}