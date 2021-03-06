'use strict';

(function () {

  function ImportExcel(XLSX, $q, $timeout) {

    function defaultParser(val) {
      return _.upperFirst(_.trim(val));
    }

    function readFile(file, columns) {

      const columnTranslation = {};

      _.each(columns, column => {

        if (_.isUndefined(column.defaultValue)) {
          column.defaultValue = null;
        }

        const parser = column.parser || defaultParser;

        columnTranslation[column.label] = {
          name: column.name,
          compute: row => {
            const res = column.compute ? column.compute(row) : parser(row[column.label]);
            return res || column.defaultValue;
          }
        };

      });

      return $q((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function (e) {

          try {

            const data = e.target.result;
            const res = XLSX.read(data, {type: 'binary'});
            if (!_.get(res, 'SheetNames.length')) {
              return reject('Неизвестный формат файла');
            }
            const xlsxData = XLSX.utils.make_json(res.Sheets[res.SheetNames[0]]);

            const vmData = _.map(xlsxData, (row, idx) => {
              const res = {
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
          .then(() => reader.readAsBinaryString(file.lfFile));

      });

    }

    return {
      readFile
    };

  }

  angular.module('vseramki')
    .service('ImportExcel', ImportExcel);

})();
