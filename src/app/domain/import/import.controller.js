'use strict';

(function () {

  function ImportController(XLSX, $timeout, $q, Schema, $scope, ToastHelper, $state) {

    var {Baguette, Material} = Schema.models();
    var vm = this;

    _.assign(vm, {

      title: `Загрузка ${Baguette.labels.ofMany} из файла`,
      data: null,
      xlsReadClick,
      loadDataClick,
      cancelLoadDataClick,

      labels: {
        imported: 'Обновлено',
        ignored: 'Без изменений',
        hasErrors: 'С ошибками'
      },

      // mimeTypeRe: 'application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      doneClick: () => $state.go('baguettes')

    });

    /*
     Init
     */

    var columns = [
      {
        name: 'codeExternal',
        label: 'Код'
      }, {
        name: 'nameExternal',
        label: 'Наименование'
      }, {
        name: 'code',
        label: 'Артикул'
      }, {
        name: 'borderWidth',
        label: 'Ширина багета',
        parser: parseInt,
        defaultValue: 0
      }, {
        name: 'materialName',
        label: 'Материал',
        ref: 'materialId'
      }
    ];

    var columnTranslation = {};

    _.each(columns, column => {
      if (_.isUndefined(column.defaultValue)) {
        column.defaultValue = null;
      }
      columnTranslation[column.label] = {
        name: column.name,
        parser: value => (column.parser || _.trim)(value) || column.defaultValue
      };
    });

    var validFields = _.map(columns, column => column.ref || column.name);

    vm.busy = Baguette.findAll();


    /*
     Listeners
     */

    $scope.$watch('vm.xlsxUploadForm.$valid', isValid => {
      if (isValid && vm.files.length === 1) {
        vm.busyReading = xlsReadClick()
          .catch(err => {
            vm.filesApi.removeAll();
            ToastHelper.error(angular.toJson(err));
            return false;
          })
          .then(res => {
            vm.busyReading = false;
            vm.readyToImport = !!res;
          });
      }
    });

    $scope.$watch('vm.xlsxUploadForm.$error.filesize', error => {
      if (error) {
        ToastHelper.error('Файл слишком большой');
        vm.filesApi.removeAll();
      }
    });

    /*
     Functions
     */

    function cancelLoadDataClick() {
      vm.data = false;
      vm.readyToImport = false;
      vm.filesApi.removeAll();
    }

    function loadDataClick() {

      var total = vm.data.length;
      var value = 0;

      vm.readyToImport = false;

      vm.progress = {
        value: 0
      };

      var errors = [];
      var results = {
        imported: 0,
        ignored: 0
      };

      function importItem () {
        var item = vm.data.pop();
        return saveItem(item)
          .then(res => {
            if (res) {
              results.imported ++;
            } else {
              results.ignored ++;
            }
          })
          .catch(err => {
            errors.push(_.assign(item, {
              error: _.get(err, 'data.text') || err.data
            }));
          })
          .then(() => {
            vm.progress.value = Math.round(++value / total * 100);
            if (value === total) {
              vm.progress = false;
              vm.data = errors;
              results.hasErrors = errors.length;
              vm.doneImport = results;
              return;
            }
            $timeout().then(importItem);
          });
      }

      importItem();

    }

    function saveItem(item) {

      item.materialId = _.get(_.first(Material.filter({
          where: {
            name: {
              likei: item.materialName
            }
          }
        })), 'id') || null;

      var baguette = _.first(Baguette.filter({
        codeExternal: item.codeExternal
      }));

      if (!baguette) {
        baguette = Baguette.createInstance({
          name: item.nameExternal,
          isValid: false
        });
      }

      _.assign(baguette, _.pick(item, validFields));

      if (baguette.id && !Baguette.hasChanges(baguette)) {
        return $q.resolve()
      }

      return Baguette.create(baguette);

    }

    function xlsReadClick() {

      return $q((resolve, reject) => {

        var file = _.first(vm.files);
        var reader = new FileReader();

        reader.onload = function (e) {

          try {

            var data = e.target.result;
            var res = XLSX.read(data, {type: 'binary'});
            if (!_.get(res,'SheetNames.length')) {
              return reject('Неизвестный формат файла');
            }
            var xlsxData = XLSX.utils.make_json(res.Sheets[res.SheetNames[0]]);

            vm.columns = _.map(columns, (col) => {
              return {name: col.name, title: col.label};
            });

            vm.data = _.map(xlsxData, (row, idx) => {
              var res = {
                index: idx + 1
              };

              _.each(columnTranslation, (val, key) => {
                res[val.name] = val.parser(row[key]);
              });

              return res;
            });

            resolve(vm.data);

          } catch (e) {
            reject('Не удалось прочитать файл');
          }

        };

        $timeout(100)
          .then(()=>reader.readAsBinaryString(file.lfFile));

      });

    }


  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
