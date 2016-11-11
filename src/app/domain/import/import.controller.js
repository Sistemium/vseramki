'use strict';

(function () {

  function ImportController($timeout, $q, Schema, $scope, $state, Helpers) {

    const {ImportExcel, ToastHelper, ImportConfig, ControllerHelper} = Helpers;
    const {Baguette, Material, Brand} = Schema.models();

    var columns = ImportConfig.Baguette;

    var vm = ControllerHelper.setup(this, $scope)
      .use({

        title: `Загрузка ${Baguette.labels.ofMany} из файла`,
        data: null,

        labels: {
          imported: 'Обновлено',
          ignored: 'Без изменений',
          hasErrors: 'С ошибками'
        },

        loadDataClick,
        cancelLoadDataClick,
        doneClick,
        tableHeaderRemoveClick

        // mimeTypeRe: 'application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',


      });

    /*
     Init
     */


    vm.busy = Baguette.findAll();


    /*
     Listeners
     */

    $scope.$watch('vm.xlsxUploadForm.$valid', isValid => {
      if (isValid && vm.files.length === 1) {
        vm.busyReading = ImportExcel.readFile(_.first(vm.files), columns)
          .catch(err => {
            vm.filesApi.removeAll();
            ToastHelper.error(angular.toJson(err));
            return false;
          })
          .then(res => vm.use({
            busyReading: false,
            readyToImport: !!res,
            data: res,
            columns: _.clone(columns)
          }));
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

    function doneClick() {
      $state.go('baguettes');
    }

    function cancelLoadDataClick() {
      vm.use({
        data: false,
        readyToImport: false
      })
        .filesApi.removeAll();
    }

    function tableHeaderRemoveClick(column) {
      _.remove(vm.columns, {name: column.name});
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

      var validFields = _.map(vm.columns, column => {
        return {
          name: column.ref || column.name,
          replace: column.replace !== false
        }
      });

      var saveItem = saveBaguetteItem;

      function importItem() {
        var item = vm.data.pop();
        return saveItem(item, validFields)
          .then(res => {
            if (res) {
              results.imported++;
            } else {
              results.ignored++;
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

    function saveBaguetteItem(item, validFields) {

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


  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
