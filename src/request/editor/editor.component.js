class EditorCtrl {
  constructor($scope, $state, $stateParams, RequestService) {
    this.$scope = $scope;
    this.$state = $state;
    this.RequestService = RequestService;
    this.isSubmitting = true;

    if ($stateParams.id) {
      RequestService.find($stateParams.id).then(request => {
        this.request = request;
        this.isSubmitting = false;
      });
    } else {
      this.request = this.request || {
        type: 'New Feature',
        priority: '',
        description: ''
      };
      this.isSubmitting = false;
    }
  }

  submit() {
    this.isSubmitting = true;

    this.RequestService.save(this.request).then(() => {
      this.$state.go('app.requests');
    });
  }

  handleFileRead(file) {
    if (!this.request.attachments) {
      this.request.attachments = [];
    }

    this.$scope.$apply(() => {
      this.request.attachments.push({ file })
    });
  }

  removeAttachment(index) {
    this.request.attachments.splice(index, 1);
  }
}

export default {
  bindings: {},
  templateUrl: 'request/editor/editor.component.html',
  controller: EditorCtrl
}