class CommentsCtrl {
  constructor(CommentService) {
    this.CommentService = CommentService;

    this.newComment = {};
    this.isSubmitting = false;
  }

  submit($event) {
    const ENTER = 13;

    if ($event && $event.keyCode != ENTER) {
      return;
    } else {
      $event.preventDefault();
    }

    this.isSubmitting = true;

    this.newComment.relatedRequest = this.requestId;

    this.CommentService.add(this.newComment).then(comment => {
      this.comments.unshift(comment);
      this.isSubmitting = false;
    })

    this.newComment = {};
  }
}

export default {
  bindings: {
    comments: '=data',
    requestId: '='
  },
  templateUrl: 'request/comment/comments.component.html',
  controller: CommentsCtrl
}