'use strict';

(function () {

  function ImportExcel(XLSX, $q, $timeout) {

    function readFile(file, columns) {

      var columnTranslation = {};

      _.each(columns, column => {

        if (_.isUndefined(column.defaultValue)) {
          column.defaultValue = null;
        }

        var parser = column.parser || _.trim;

        columnTranslation[column.label] = {
          name: column.name,
          compute: row => {
            var res = column.compute ? column.compute(row) : parser(row[column.label]);
            return res || column.defaultValue;
          }
        };

      });

      return $q((resolve, reject) => {

        var reader = new FileReader();

        reader.onload = function (e) {

          try {

            var data = e.target.result;
            var res = XLSX.read(data, {type: 'binary'});
            if (!_.get(res,'SheetNames.length')) {
              return reject('Неизвестный формат файла');
            }
            var xlsxData = XLSX.utils.make_json(res.Sheets[res.SheetNames[0]]);

            var vmData = _.map(xlsxData, (row, idx) => {
              var res = {
                index: idx + 1
              };

              _.each(columnTranslation, (val) => {
                res[val.name] = val.compute(row);
              });

              return res;
            });

            resolve(vmData);

          } catch (e) {
            reject('Не удалось прочитать файл');
          }

        };

        $timeout(100)
          .then(()=>reader.readAsBinaryString(file.lfFile));

      });

    }

    return {
      readFile
    };

  }

  angular.module('vseramki')
    .service('ImportExcel', ImportExcel);

})();
