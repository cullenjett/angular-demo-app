class EditorCtrl {
  constructor($state, $stateParams, RequestService) {
    this.$state = $state;
    this.RequestService = RequestService;
    this.isSubmitting = true;

    console.log($stateParams)

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
}

export default {
  bindings: {},
  templateUrl: 'request/editor/editor.component.html',
  controller: EditorCtrl
}