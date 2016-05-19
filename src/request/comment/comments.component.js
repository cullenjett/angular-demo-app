class CommentsCtrl {
  constructor(CommentService) {
    this.CommentService = CommentService;

    this.newComment = {};
  }

  submit() {
    this.newComment.relatedRequest = this.requestId;

    this.CommentService.add(this.newComment).then(comment => {
      this.comments.unshift(comment);
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