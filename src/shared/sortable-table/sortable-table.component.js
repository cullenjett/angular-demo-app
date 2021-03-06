class SortableTableCtrl {
  constructor($scope) {
    this.columns = {};
    this.sortOn = null;
    this.sortReverse = false;
    this.characterLimit = parseInt(this.characterLimit) || 60;

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
      let row = {
        id: obj.id,
        data: {}
      };
      let value;
      let configFieldName;

      this.fieldList.forEach(field => {
        if (typeof field === 'string') {
          value = this.parseFieldType(obj[field]);
          row.data[field] = value;
        } else if (typeof field === 'object') {
          configFieldName = Object.keys(field)[0];
          value = this.parseFieldType(obj[configFieldName]);
          row.data[configFieldName] = value;
        }
      });

      return row;
    });

    this.columnCount = Object.keys(this.columns).length;
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

    this.sortOn = 'data.' + fieldName;

    if (prevSortOn === this.sortOn) {
      this.sortReverse = !this.sortReverse;
    }
  }

  getSortClass(fieldName) {
    let augmentedFieldName = 'data.' + fieldName;
    let ascClass = "fa fa-sort-asc";
    let descClass = "fa fa-sort-desc";

    if (augmentedFieldName !== this.sortOn) return '';
    return this.sortReverse ? ascClass : descClass;
  }
}

export default {
  bindings: {
    data: '=',
    fieldList: '=',
    isLoading: '=',
    characterLimit: '@',
    rowLimit: '@',
    onClickRow: "&"
  },
  templateUrl: 'shared/sortable-table/sortable-table.component.html',
  controller: SortableTableCtrl
}