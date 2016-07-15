export default class CommentService {
  constructor($q, quickbase, FlashService, UserService) {
    this.$q = $q;
    this.quickbase = quickbase;
    this.UserService = UserService;
    this.FlashService = FlashService;
  }

  add(comment) {
    let dfd = this.$q.defer();

    this.UserService.currentUser().then(user => {
      comment.relatedUser = user.id;

      this.quickbase.comments.addRecord(comment, (res) => {
        if (res.error) {
          this.FlashService.error(res.error.message);
        }

        let d = new Date();

        comment.id = res;
        comment.relatedUserName = user.name;
        comment.dateCreated = d.getTime();
        dfd.resolve(comment);
      });
    });

    return dfd.promise;
  }

  where(query) {
    let dfd = this.$q.defer();

    this.quickbase.comments.doQuery(query, {slist: 'dateCreated', options: 'sortorder-D'}, (res) => {
      if (res.error) {
        this.FlashService.error(res.error.message);
      }

      dfd.resolve(res);
    });

    return dfd.promise;
  }
}