'use strict';

(function () {

  function ImportController(ImportExcel, $timeout, $q, Schema, $scope, ToastHelper, $state, ImportConfig) {

    var {Baguette, Material, Brand} = Schema.models();
    var columns = ImportConfig.Baguette;
    var vm = this;

    _.assign(vm, {

      title: `Загрузка ${Baguette.labels.ofMany} из файла`,
      data: null,
      modifiedBaguette: [],
      selected: [],

      labels: {
        imported: 'Обновлено',
        ignored: 'Без изменений',
        hasErrors: 'С ошибками'
      },

      loadDataClick,
      cancelLoadDataClick,
      doneClick,
      tableHeaderRemoveClick,
      tableRowRemoveClick

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
          .then(res => {

            vm.busyReading = false;
            vm.readyToImport = !!res;
            vm.data = res;
            vm.columns = _.clone(columns);

          });
      }
    });

    $scope.$watch('vm.xlsxUploadForm.$error.filesize', error => {
      if (error) {
        ToastHelper.error('Файл слишком большой');
        vm.filesApi.removeAll();
      }
    });

    $scope.$watch('vm.columns.length', () => {
      if (vm.data) {
        checkForNewBaguette();
      }
    });

    /*
     Functions
     */

    function tableRowRemoveClick(row) {
      _.remove(vm.modifiedBaguette, row);
    }

    function checkForNewBaguette() {

      var validFields = _.map(vm.columns, column => {
        return {
          name: column.ref || column.name,
          replace: column.replace !== false
        }
      });

      vm.modifiedBaguette = [];

      _.each(vm.data, function (elem, index) {

        setBaguetteRefs(elem);

        var baguette = elem.codeExternal && _.first(Baguette.filter({
            codeExternal: elem.codeExternal
          }));

        if (baguette) {

          var diff = {};

          _.each(validFields, field => {
            if (field.replace && baguette[field.name] !== elem[field.name]) {
              diff[field.name] = true;
            } else {
              elem[field.name] = baguette[field.name];
            }
          });

          if (Object.keys(diff).length) {
            vm.modifiedBaguette.push({
              importData: elem,
              diff: diff,
              instance: baguette,
              index
            });
          }

        } else {

          baguette = Baguette.createInstance({
            name: elem.nameExternal,
            isValid: false
          });

          vm.modifiedBaguette.push({
            importData: elem,
            instance: baguette,
            index
          });

        }

        diff = {};

      });

    }

    function setBaguetteRefs(item) {

      item.materialId = item.materialName && _.get(_.first(Material.filter({
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

    }

    function doneClick() {
      $state.go('baguettes');
    }

    function cancelLoadDataClick() {
      _.remove(vm.modifiedBaguette);
      vm.data = false;
      vm.readyToImport = false;
      vm.filesApi.removeAll();
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

      var saveItem = saveBaguetteItem;

      function importItem() {
        var item = vm.modifiedBaguette.pop();

        if (!item) {
          vm.progress = false;
          vm.data = errors;
          results.hasErrors = errors.length;
          vm.doneImport = results;
          return;
        }

        return saveItem(item)
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
            $timeout().then(importItem);
          });
      }

      importItem();

    }

    function saveBaguetteItem(item) {

      // _.assign(item.instance, item.importData);
      _.each(columns, column => {
        var name = column.ref || column.name;
        item.instance[name] = item.importData[name];
      });
      return Baguette.create(item.instance);

    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
