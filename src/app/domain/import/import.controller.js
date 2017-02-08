'use strict';

(function () {

  function ImportController(ImportExcel, $timeout, Schema, $scope, ToastHelper, $state, ImportConfig, AlertHelper) {

    var vm = this;

    var modelName = $state.params.model;
    var model = Schema.model(modelName);
    var importConfig = ImportConfig[modelName];
    var columns = importConfig[modelName + 'Columns'];

    var baguetteModel = Schema.model('Baguette');
    baguetteModel.findAll({limit: 4000});


    _.assign(vm, {

      title: `Загрузка ${model.labels.ofMany} из файла`,
      data: null,
      modifiedData: [],
      selected: [],
      recordData: {},

      labels: {
        imported: 'Обновлено',
        ignored: 'Без изменений',
        hasErrors: 'С ошибками'
      },

      loadDataClick,
      cancelLoadDataClick,
      doneClick,
      tableHeaderRemoveClick,
      tableRowRemoveClick,
      addPropertyClick

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
        vm.busyMessage = 'Чтение файла ...';
        vm.busyReading = ImportExcel.readFile(_.first(vm.files), columns)
          .catch(err => {
            vm.filesApi.removeAll();
            ToastHelper.error('Ошибка. ' + err);
            return false;
          })
          .then(res => {

            if (res) {
              vm.readyToImport = !!res;
              vm.data = res;
              vm.columns = _.clone(columns);
            } else {
              vm.busyReading = false;
            }

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
      vm.busyMessage = 'Проверка данных ...';
      $timeout().then(()=> {
        if (vm.data) {
          setModifiedData();
        }
        vm.busyReading = false;
      })
    });

    /*
     Functions
     */


    function addPropertyClick(col, row, ev) {

      var validFields = _.filter(vm.columns, 'ref');
      var isValidColumn = _.findKey(validFields, {'model': col.model});

      // var test = ['Material', 'Surface', 'Colour', 'Brand'];
      // var isValidColumn = _.indexOf(test, col.model);
      //console.log(isValidColumn, 'isValidColumn');

      if (isValidColumn >= 0) {
        var propertyName = (row.importData[col.name]);
        var model = Schema.model(col.model);

        var isExistingProperty = !!_.get(_.first(model.filter({
            where: {
              name: {
                likei: propertyName
              }
            }
          })), 'id') || false;


        if (!isExistingProperty) {
          AlertHelper.showConfirm(ev, `Добавить ${col.label.toLowerCase()} "${propertyName}" ?`)
            .then(function () {
              model.create({name: propertyName}).then(()=> {
                ToastHelper.success('Добавлено');
                setModifiedData();
              })
            });
        }

      }

    }

    function tableRowRemoveClick(row) {
      _.remove(vm.modifiedData, row);
      vm.recordData.ommitedRecord++;
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
      vm.recordData = {
        newRecord: 0,
        modifiedRecord: 0,
        ommitedRecord: 0
      };

      _.each(vm.data, function (elem, index) {

        setModelRefs(elem, _.filter(validFields, 'ref'));

        var instance = elem.codeExternal && _.first(model.filter({
            codeExternal: elem.codeExternal
          }));

        if (instance) {

          var diff = {};

          _.each(validFields, field => {
            if ((field.replace || !instance[field.id]) && instance[field.id] !== elem[field.id]) {
              diff[field.name] = _.get(instance, field.name) || '(пусто)';
            } else {
              elem[field.id] = instance[field.id];
            }
          });

          if (Object.keys(diff).length) {

            vm.recordData.modifiedRecord++;

            vm.modifiedData.push({
              importData: elem,
              diff: diff,
              instance: instance,
              index
            });
          }

        } else {

          vm.recordData.newRecord++;

          instance = model.createInstance({
            name: elem.nameExternal,
            isValid: false
          });

          vm.modifiedData.push({
            importData: elem,
            instance: instance,
            index
          });

        }

        diff = {};

      });

      vm.recordData.notModified = vm.data.length - vm.recordData.modifiedRecord - vm.recordData.newRecord;

    }

    function setModelRefs(item, config) {

      _.each(config, function (val) {

        if (val.name != 'baguetteId') {

          var model = Schema.model(val.model);

          item[val.ref] = item[val.name] && _.get(_.first(model.filter({
              where: {
                name: {
                  likei: item[val.name]
                }
              }
            })), 'id') || null;
        }

      });

    }

    function doneClick() {
      $state.go(importConfig.doneSref);
    }

    function cancelLoadDataClick() {

      vm.modifiedData = false;
      vm.columns = false;

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

      var total = vm.modifiedData.length;
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

      //cancelLoadDataClick();
    }

  }

  angular.module('vseramki')
    .controller('ImportController', ImportController);

})();
