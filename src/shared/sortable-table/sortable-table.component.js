class SortableTableCtrl {
  constructor($scope) {
    this.columns = {};
    this.sortOn = '';
    this.sortReverse = false;

    $scope.$watch('$ctrl.data', (newVal, oldVal) => {
      this.calculateLayout(newVal);
    });
  }

  calculateLayout(data) {
    this.fieldList.forEach(field => {
      if (typeof field === 'string') {
        this.columns[field] = this.camelCaseToText(field)
      } else if (typeof field === 'object') {
        let configFieldName = Object.keys(field)[0];
        let userEnteredFieldName = field[configFieldName];
        this.columns[configFieldName] = userEnteredFieldName;
      }
    });

    this.rows = data.map(obj => {
      let row = {};
      this.fieldList.forEach(fieldName => {
        let value = this.parseFieldType(obj[fieldName]);
        row[fieldName] = value;
      });
      return row;
    });

    this.sortOn = Object.keys(this.columns)[0];
  }

  camelCaseToText(word) {
    return word.match(/^[a-z]+|[A-Z][a-z]*/g).map(function(match){
      return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
    }).join(' ');
  }

  parseFieldType(value) {
    // Return strings
    if (isNaN(value)) {
      return value;

    // Else it's a number
    } else {
      // Is it a date?
      if (BaseHelpers.dateToString(value) != "NaN-NaN-Nan" && BaseHelpers.dateToString(value) != "01-01-1970") {
        return BaseHelpers.dateToString(value)

      // Else it's just a number
      } else {
        return parseFloat(value);
      }
    }

    return value;
  }

  sortTable(fieldName) {
    let prevSortOn = this.sortOn;

    this.sortOn = fieldName;

    if (prevSortOn === this.sortOn) {
      this.sortReverse = !this.sortReverse;
    }
  }

  getSortClass(fieldName) {
    var ascClass = "fa fa-sort-asc";
    var descClass = "fa fa-sort-desc";

    if (fieldName !== this.sortOn) return '';
    return this.sortReverse ? ascClass : descClass;
  }
}

export default {
  bindings: {
    data: '=',
    fieldList: '=',
    isLoading: '='
  },
  templateUrl: 'shared/sortable-table/sortable-table.tmpl.html',
  controller: SortableTableCtrl
}