'use strict';

(function () {

  function ImportController(ImportExcel, $timeout, Schema, $scope, ToastHelper, $state, ImportConfig) {

    var vm = this;

    var modelName = $state.params.model;
    var model = Schema.model(modelName);
    var importConfig = ImportConfig[modelName];
    var columns = importConfig.columns;

    _.assign(vm, {

      title: `Загрузка ${model.labels.ofMany} из файла`,
      data: null,
      modifiedData: [],
      selected: [],
      recordData: {
        newRecord: 0,
        modifiedRecord: 0
      },

      _get: _.get,

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


    vm.busy = model.findAll();


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
        setModifiedData();
      }
    });

    /*
     Functions
     */

    function tableRowRemoveClick(row) {
      _.remove(vm.modifiedData, row);
    }

    function setModifiedData() {

      var validFields = _.map(vm.columns, column => {
        return {
          id: column.ref || column.name,
          name: column.name,
          replace: column.replace !== false,
          model: column.model,
          ref: column.ref
        }
      });

      vm.modifiedData = [];

      _.each(vm.data, function (elem, index) {

        setModelRefs(elem, _.filter(validFields, 'ref'));

        var baguette = elem.codeExternal && _.first(model.filter({
            codeExternal: elem.codeExternal
          }));

        if (baguette) {

          var diff = {};

          _.each(validFields, field => {
            if (field.replace && baguette[field.id] !== elem[field.id]) {
              diff[field.name] = true;
            } else {
              elem[field.id] = baguette[field.id];
            }
          });

          if (Object.keys(diff).length) {

            vm.recordData.modifiedRecord++;

            vm.modifiedData.push({
              importData: elem,
              diff: diff,
              instance: baguette,
              index
            });
          }

        } else {

          vm.recordData.newRecord++;

          baguette = model.createInstance({
            name: elem.nameExternal,
            isValid: false
          });

          vm.modifiedData.push({
            importData: elem,
            instance: baguette,
            index
          });

        }

        diff = {};

      });

      vm.recordData.notModified = vm.data.length - vm.recordData.modifiedRecord - vm.recordData.newRecord;

    }

    function setModelRefs(item, config) {

      _.each(config, function (val) {

        var model = Schema.model(val.model);

        item[val.ref] = item[val.name] && _.get(_.first(model.filter({
            where: {
              name: {
                likei: item[val.name]
              }
            }
          })), 'id') || null;

      });

    }

    function doneClick() {
      $state.go(importConfig.doneSref);
    }

    function cancelLoadDataClick() {

      _.remove(vm.modifiedData);
      _.remove(vm.columns);

      vm.data = false;
      vm.readyToImport = false;
      vm.filesApi.removeAll();

      _.each(vm.recordData, function (val, key) {
        vm.recordData[key] = 0
      })

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

      var saveItem = saveModelItem;

      function importItem() {
        var item = vm.modifiedData.pop();

        if (!item) {
          vm.progress = false;
          vm.modifiedData = errors;
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

    function saveModelItem(item) {

      // _.assign(item.instance, item.importData);
      _.each(columns, column => {
        var name = column.ref || column.name;
        item.instance[name] = item.importData[name];
      });
      return model.create(item.instance);

    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
