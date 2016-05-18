class FileUploaderCtrl {
  constructor($q, $element) {
    this.$q = $q;
    this.$el = $element.find('.drag-and-drop');
    this.$fileInput = this.$el.find('.drag-and-drop__file');
    this.hoverClass = "drag-and-drop--drag-hover";
    this.uploadingClass = "drag-and-drop--is-reading";
  }

  $onInit() {
    this.$el
      .on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', (e) => { this.$el.addClass(this.hoverClass); })
      .on('dragleave dragend drop', (e) => { this.$el.removeClass(this.hoverClass); })
      .on('drop', this.handleFileSelect.bind(this));

    this.$fileInput.on('change', this.handleFileSelect.bind(this));
  }

  handleFileSelect(e) {
    var files;
    var fileReadPromises = [];

    if (e.type == 'drop') {
      files = e.originalEvent.dataTransfer.files;
    } else if (e.type == 'change') {
      files = e.target.files;
    }

    this.$el.addClass(this.uploadingClass);

    angular.forEach(files, (file) => {
      fileReadPromises.push(this.readFile(file));
    });

    this.$q.all(fileReadPromises).then(() => {
      this.$el.removeClass(this.uploadingClass)
    });
  }

  readFile(file) {
    var dfd = this.$q.defer();
    var fileName = file.name;
    var reader = new FileReader();

    reader.onload = (loadEvent) => {
      var binary = "";
      var bytes = new Uint8Array(loadEvent.target.result);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      // Here we are calling the function that is passed in to the component via the [on-file-read] attribute.
      // Note the structure of the argument passed to that function:
      // {file: <what I really want to pass as an argument>}
      // This is an Angular-ism. See this post for details:
      // http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-3-isolate-scope-and-function-parameters
      this.onFileRead({
        file: {
          filename: fileName,
          body: btoa(binary),
          ignoreEncoding: true
        }
      });

      dfd.resolve();
    };

    // IE doesn't support FileReader().readAsBinaryString, so I used the solution here as an alternative:
    // http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
    reader.readAsArrayBuffer(file);

    return dfd.promise;
  }
}

export default {
  bindings: {
    onFileRead: "&"
  },
  templateUrl: "shared/file-uploader/file-uploader.component.html",
  controller: FileUploaderCtrl
}