class RequestsCtrl {
  constructor(RequestService, AuthService) {
    this.myRequests = [];
    this.isLoading = true;
    this.filters = ['All', 'Open', 'In Progress', 'Closed'];
    this.activeFilter = 'All';

    RequestService.where({
      relatedUserUsername: AuthService.currentUser().username
    }).then(requests => {
      this.requests = requests;
      this.myRequests = requests;
      this.isLoading = false;
    })
  }

  filter(status) {
    if (this.activeFilter === status) {
      return false;
    }

    if (status == 'All') {
      this.myRequests = this.requests;
    } else {
      this.myRequests = this.requests.filter(request => {
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