'use strict';

(function () {

  function ImportController(XLSX, $timeout) {

    var vm = this;

    _.assign(vm, {
      data: null,
      startButtonClick,

      columnTranslation: {
        'Код': 'code',
        'Наименование': 'name',
        'Артикул': 'articleCode',
        'Ширина багета': 'borderWidth'
      }

    });

    /*
     Init
     */

    /*
     Listeners
     */

    /*
     Functions
     */

    function startButtonClick() {

      var file = _.first(vm.files);
      var reader = new FileReader();

      reader.onload = function (e) {

        var data = e.target.result;
        var res = XLSX.read(data, {type: 'binary'});

        $timeout().then(()=> {

          var xlsxData = XLSX.utils.make_json(res.Sheets[res.SheetNames[0]]);

          vm.columns = _.map(vm.columnTranslation, (val, key) => {
            return {name: val, title: key};
          });

          vm.data = _.map(xlsxData, (row, idx) => {
            var res = {
              index: idx + 1
            };

            _.each(vm.columnTranslation, (val, key) => {
              res[val] = row[key];
            });

            return res;
          });

        });

      };

      reader.readAsBinaryString(file.lfFile);

    }


  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
