class RequestsCtrl {
  constructor($state, $stateParams, UserService, RequestService, AuthService) {
    this.$state = $state;

    this.activeRequests = [];
    this.isLoading = true;
    this.filters = ['All', 'Open', 'In Progress', 'Complete'];
    this.activeFilter = $stateParams.filter || 'All';

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

  onClickRow(id) {
    this.$state.go('app.requestEditor', { id });
  }
}

export default {
  bindings: {},
  templateUrl: 'request/requests.component.html',
  controller: RequestsCtrl
}