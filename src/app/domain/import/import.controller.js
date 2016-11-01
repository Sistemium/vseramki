'use strict';

(function () {

  function ImportController(XLSX, $timeout, $q, Schema, $scope, ToastHelper, $state) {

    var {Baguette, Material, Brand} = Schema.models();
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
        label: 'Артикул',
        replace: false
      }, {
        name: 'borderWidth',
        label: 'Ширина багета',
        parser: parseInt,
        defaultValue: 0
      }, {
        name: 'materialName',
        label: 'Материал',
        ref: 'materialId'
      }, {
        name: 'brandName',
        label: 'Бренд',
        ref: 'brandId',
        replace: false,
        compute: item => {

          var name = item['Наименование'];
          if (!name) {
            return null;
          }

          var re = /"(.+)"/;
          var res = _.last(name.match(re));

          if (res) {
            return res;
          }

          re = / ([А-Я][а-я]+) /;
          res = _.last(name.match(re));

          return res;

        }
      }
    ];

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

    var validFields = _.map(columns, column => {
      return {
        name: column.ref || column.name, replace: !! column.replace
      }
    });

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

    Brand.bindAll({}, $scope, 'vm.brands');

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

      item.brandId = item.brandName && _.get(_.first(Brand.filter({
          where: {
            name: {
              likei: item.brandName
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

      _.each(validFields, field => {
        if (field.replace || !baguette[field.name]) {
          baguette[field.name] = item[field.name];
        }
      });

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

              _.each(columnTranslation, (val) => {
                res[val.name] = val.compute(row);
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
