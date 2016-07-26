class EditorCtrl {
  constructor($scope, $state, $stateParams, AttachmentService, CommentService, RequestService) {
    this.$scope = $scope;
    this.$state = $state;
    this.RequestService = RequestService;
    this.AttachmentService = AttachmentService;

    this.isSubmitting = true;

    if ($stateParams.id) {
      RequestService.find($stateParams.id).then(request => {
        this.request = request;
        this.editMode = true;
        this.title = `Edit Request #${request.id}`;

        AttachmentService.where({relatedRequest: $stateParams.id}).then(attachments => {
          this.request.attachments = attachments.map(attachment => {
            attachment.file.filename = attachment.file.filename.replace(/%20/g, " ");
            return attachment;
          });
          this.isSubmitting = false;
        });

        CommentService.where({relatedRequest: $stateParams.id}).then(comments => {
          this.comments = comments;
        });
      });
    } else {
      this.title = "New Request";
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

    this.request.attachments.push({ file })
  }

  removeAttachment(attachment, index) {
    let isExistingAttachment = attachment.id

    if (isExistingAttachment) {
      this.AttachmentService.delete(attachment.id);
    }

    this.request.attachments.splice(index, 1);
  }
}

export default {
  bindings: {},
  templateUrl: 'request/editor/editor.component.html',
  controller: EditorCtrl
}